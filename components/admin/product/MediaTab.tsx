"use client";
import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type MediaItem = { id?: string; url: string; file?: File };

type Props = {
  mediaItems: MediaItem[];
  onChange: (items: MediaItem[]) => void;
};

export default function MediaTab({ mediaItems, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (files: File[]) => {
    const maxSize = 2 * 1024 * 1024;
    const valid = files.filter(f => {
      if (f.size > maxSize) { alert(`${f.name} exceeds 2MB`); return false; }
      return true;
    });
    const newItems = valid.map(f => ({ url: URL.createObjectURL(f), file: f }));
    onChange([...mediaItems, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div className="space-y-4">
      <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
        onChange={(e) => addFiles(Array.from(e.target.files ?? []))} />

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`rounded-xl border-2 border-dashed p-8 flex flex-col items-center gap-2 cursor-pointer transition-colors ${dragging ? "border-brand bg-brand/5" : "border-border hover:bg-accent/50"}`}
      >
        <Upload className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Drag & drop files here, or <span className="text-brand">Browse Files</span></p>
        <p className="text-xs text-muted-foreground/60">PNG, JPG, GIF up to 2MB</p>
      </div>

      {mediaItems.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {mediaItems.map((item, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-border aspect-video">
              <img src={item.url} alt="" className="w-full h-full object-cover" />
              <button type="button"
                onClick={() => onChange(mediaItems.filter((_, idx) => idx !== i))}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}