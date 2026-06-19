"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload, Search, Grid3X3, List, Copy, Download,
  Pencil, Trash2, FileImage, FileVideo, File, X, Check
} from "lucide-react";
import { useMediaStore, type MediaFile } from "@/store/mediaStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";
type FilterType = "all" | "image" | "video" | "pdf";

function FileIcon({ type, className }: { type: string; className?: string }) {
  if (type === "image") return <FileImage className={cn("text-blue-500", className)} />;
  if (type === "video") return <FileVideo className={cn("text-purple-500", className)} />;
  return <File className={cn("text-muted-foreground", className)} />;
}

export default function MediaLibraryPage() {
  const { files, stats, loading, uploading, total, fetchMedia, fetchStats, uploadFile, renameFile, deleteFile } =
    useMediaStore();

  const [view, setView]           = useState<ViewMode>("grid");
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState<FilterType>("all");
  const [dragging, setDragging]   = useState(false);
  const [editId, setEditId]       = useState<string | null>(null);
  const [editName, setEditName]   = useState("");
  const fileInputRef              = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia(1, search, filter);
    fetchStats();
  }, []);

  // Search with debounce
  useEffect(() => {
    const t = setTimeout(() => fetchMedia(1, search, filter), 400);
    return () => clearTimeout(t);
  }, [search, filter]);

  // Drag & drop
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    for (const file of droppedFiles) {
      await uploadFile(file);
    }
    fetchStats();
  }, []);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    for (const file of selected) {
      await uploadFile(file);
    }
    fetchStats();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied!");
  };

  const handleDownload = (url: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  };

  const startEdit = (file: MediaFile) => {
    setEditId(file.id);
    setEditName(file.name);
  };

  const saveEdit = async () => {
    if (!editId) return;
    await renameFile(editId, editName);
    setEditId(null);
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Media Library</h1>
          <p className="text-sm text-muted-foreground">{total} Files</p>
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-brand hover:bg-brand-hover text-white gap-2"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload"}
        </Button>
        <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,.pdf"
          className="hidden" onChange={handleFileInput} />
      </div>

      {/* Search + Filter + View Toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Type filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="h-10 px-3 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="pdf">PDFs</option>
        </select>

        {/* View toggle */}
        <div className="flex rounded-md border border-border overflow-hidden">
          <button
            onClick={() => setView("grid")}
            className={cn("px-3 py-2 transition-colors", view === "grid" ? "bg-brand text-white" : "hover:bg-accent")}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("px-3 py-2 transition-colors", view === "list" ? "bg-brand text-white" : "hover:bg-accent")}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
          dragging ? "border-brand bg-brand/5" : "border-border hover:bg-accent/50"
        )}
      >
        <Upload className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drag & drop files here, or{" "}
          <span className="text-brand font-medium">browse</span>
        </p>
       <p className="text-xs text-muted-foreground/60">
            Supports PNG, JPG, GIF, SVG, MP4 — Max 2MB per file  
        </p>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-muted animate-pulse aspect-square" />
            ))
          ) : files.map((file) => (
            <div key={file.id}
              className="group rounded-xl border border-border bg-background overflow-hidden hover:shadow-md transition-shadow">
              {/* Thumbnail */}
              <div className="aspect-square bg-muted relative overflow-hidden">
                {file.type === "image" ? (
                  <img src={file.url} alt={file.name}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileIcon type={file.type} className="h-10 w-10" />
                  </div>
                )}
                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleCopy(file.url)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center">
                    <Copy className="h-3.5 w-3.5 text-white" />
                  </button>
                  <button onClick={() => handleDownload(file.url, file.fileName)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center">
                    <Download className="h-3.5 w-3.5 text-white" />
                  </button>
                  <button onClick={() => startEdit(file)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center">
                    <Pencil className="h-3.5 w-3.5 text-white" />
                  </button>
                  <button onClick={() => deleteFile(file.id)}
                    className="w-8 h-8 rounded-full bg-red-500/60 hover:bg-red-500/80 flex items-center justify-center">
                    <Trash2 className="h-3.5 w-3.5 text-white" />
                  </button>
                </div>
              </div>

              {/* Name + Size */}
              <div className="p-2.5">
                {editId === file.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      className="flex-1 text-xs border border-brand rounded px-1.5 py-0.5 bg-background outline-none"
                    />
                    <button onClick={saveEdit} className="text-green-500"><Check className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setEditId(null)} className="text-muted-foreground"><X className="h-3.5 w-3.5" /></button>
                  </div>
                ) : (
                  <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                )}
                <p className="text-xs text-muted-foreground">{file.sizeLabel}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="rounded-2xl border border-border bg-background overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs uppercase">
                <th className="px-4 py-3 text-left">File</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Size</th>
                <th className="px-4 py-3 text-left">Uploaded</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">Loading...</td></tr>
              ) : files.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No files found</td></tr>
              ) : files.map((file) => (
                <tr key={file.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  {/* File */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                        {file.type === "image" ? (
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileIcon type={file.type} className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      {editId === file.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                            className="text-sm border border-brand rounded px-2 py-0.5 bg-background outline-none"
                          />
                          <button onClick={saveEdit} className="text-green-500"><Check className="h-4 w-4" /></button>
                          <button onClick={() => setEditId(null)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <span className="font-medium text-foreground truncate max-w-[200px]">{file.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{file.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{file.sizeLabel}</td>
                  <td className="px-4 py-3 text-muted-foreground">{file.uploadedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleCopy(file.url)}
                        className="text-muted-foreground hover:text-foreground" title="Copy URL">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDownload(file.url, file.fileName)}
                        className="text-muted-foreground hover:text-foreground" title="Download">
                        <Download className="h-4 w-4" />
                      </button>
                      <button onClick={() => startEdit(file)}
                        className="text-muted-foreground hover:text-foreground" title="Rename">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteFile(file.id)}
                        className="text-muted-foreground hover:text-destructive" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}