"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";

type Props = {
  value?: string;           // current image URL
  onChange: (url: string) => void;
  label?: string;
  className?: string;
};

export default function ImageUpload({ value, onChange, label, className }: Props) {
  const inputRef            = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview]     = useState<string>(value || "");
  const [error, setError]         = useState("");

  const handleFile = async (file: File) => {
    // Validate
    if (!file.type.startsWith("image/")) {
      setError("Only image files allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }

    setError("");
    setUploading(true);

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      // Upload to Laravel
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/admin/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = res.data.url;
      setPreview(uploadedUrl);
      onChange(uploadedUrl);
    } catch {
      // If upload fails, keep local preview and pass blob URL
      // Replace with real URL when backend is ready
      onChange(localUrl);
      setError("Upload failed — using local preview");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      )}

      {preview ? (
        /* Preview */
        <div className="relative rounded-xl overflow-hidden border border-border bg-muted aspect-video">
            <img                          // 👈 replace Image with img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-destructive hover:text-white hover:border-destructive transition-colors shadow-sm"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-brand" />
            </div>
          )}
        </div>
      ) : (
        /* Drop zone */
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            "border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors hover:border-brand/40 hover:bg-brand/5",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {uploading ? "Uploading..." : "Click or drag to upload"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              PNG, JPG, WEBP up to 5MB
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brand font-medium">
            <Upload className="h-3.5 w-3.5" />
            Browse files
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}