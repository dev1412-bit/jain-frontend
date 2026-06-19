"use client";

import { useState } from "react";
import {
  Plus, Trash2, GripVertical,
  Heading2, Heading3, AlignLeft,
  ImageIcon, List, Quote, Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ContentBlock } from "@/store/blogStore";
import { cn } from "@/lib/utils";
import ImageUpload from "./ImageUpload";

const BLOCK_TYPES = [
  { type: "heading",   label: "Heading H2", icon: Heading2  },
  { type: "heading3",  label: "Heading H3", icon: Heading3  },
  { type: "paragraph", label: "Paragraph",  icon: AlignLeft },
  { type: "image",     label: "Image",      icon: ImageIcon },
  { type: "list",      label: "List",       icon: List      },
  { type: "quote",     label: "Quote",      icon: Quote     },
  { type: "code",      label: "Code",       icon: Code      },
] as const;

type Props = {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
};

export default function ContentBlockBuilder({ blocks, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const addBlock = (type: string) => {
    const newBlock: ContentBlock =
      type === "heading"   ? { type: "heading",   level: 2,        content: ""              } :
      type === "heading3"  ? { type: "heading",   level: 3,        content: ""              } :
      type === "paragraph" ? { type: "paragraph",                  content: ""              } :
      type === "image"     ? { type: "image",     url: "",         alt: "",    caption: ""  } :
      type === "list"      ? { type: "list",      style: "bullet", items: [""]              } :
      type === "quote"     ? { type: "quote",                      content: "", author: "" } :
                             { type: "code",      language: "",    content: ""              };
    onChange([...blocks, newBlock]);
    setShowPicker(false);
  };

  const updateBlock = (index: number, updated: Partial<ContentBlock>) => {
    onChange(blocks.map((b, i) => i === index ? { ...b, ...updated } : b));
  };

  const removeBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const updateListItem = (blockIndex: number, itemIndex: number, value: string) => {
    const block = blocks[blockIndex] as any;
    const items = [...(block.items ?? [])];
    items[itemIndex] = value;
    updateBlock(blockIndex, { items });
  };

  const addListItem = (blockIndex: number) => {
    const block = blocks[blockIndex] as any;
    updateBlock(blockIndex, { items: [...(block.items ?? []), ""] });
  };

  const removeListItem = (blockIndex: number, itemIndex: number) => {
    const block = blocks[blockIndex] as any;
    const items = (block.items ?? []).filter((_: any, i: number) => i !== itemIndex);
    updateBlock(blockIndex, { items });
  };

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <div key={i} className="group border border-border rounded-xl overflow-hidden bg-background">

          {/* Block header */}
          <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-b border-border">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              <span className="text-xs font-medium text-muted-foreground capitalize">
                {block.type === "heading" ? `Heading H${block.level}` : block.type}
              </span>
            </div>
            <button
              type="button"
              onClick={() => removeBlock(i)}
              className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Block body */}
          <div className="p-3 space-y-2">

            {/* ── Heading ── */}
            {block.type === "heading" && (
              <Input
                value={block.content ?? ""}
                onChange={(e) => updateBlock(i, { content: e.target.value })}
                placeholder={`Heading ${block.level} text...`}
                className={cn(
                  "border-0 shadow-none focus-visible:ring-0 px-0 font-bold",
                  block.level === 2 ? "text-xl" : "text-lg"
                )}
              />
            )}

            {/* ── Paragraph ── */}
            {block.type === "paragraph" && (
              <textarea
                value={block.content ?? ""}
                onChange={(e) => updateBlock(i, { content: e.target.value })}
                placeholder="Write paragraph text..."
                rows={3}
                className="w-full text-sm text-foreground placeholder:text-muted-foreground bg-transparent border-0 resize-none focus:outline-none leading-relaxed"
              />
            )}

            {/* ── Image — file upload ── */}
            {block.type === "image" && (
              <div className="space-y-2">
                <ImageUpload
                  value={block.url}
                  onChange={(url) => updateBlock(i, { url })}
                  label="Image File"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={block.alt ?? ""}
                    onChange={(e) => updateBlock(i, { alt: e.target.value })}
                    placeholder="Alt text (for accessibility)"
                    className="text-sm h-9"
                  />
                  <Input
                    value={block.caption ?? ""}
                    onChange={(e) => updateBlock(i, { caption: e.target.value })}
                    placeholder="Caption (optional)"
                    className="text-sm h-9"
                  />
                </div>
              </div>
            )}

            {/* ── List ── */}
            {block.type === "list" && (
              <div className="space-y-2">
                <select
                  value={block.style ?? "bullet"}
                  onChange={(e) => updateBlock(i, { style: e.target.value as any })}
                  className="text-xs border border-input rounded-md px-2 py-1 bg-background text-foreground"
                >
                  <option value="bullet">Bullet List</option>
                  <option value="ordered">Numbered List</option>
                </select>
                {(block.items ?? []).map((item, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs w-5 shrink-0">
                      {block.style === "ordered" ? `${j + 1}.` : "•"}
                    </span>
                    <Input
                      value={item}
                      onChange={(e) => updateListItem(i, j, e.target.value)}
                      placeholder={`Item ${j + 1}...`}
                      className="text-sm flex-1 h-8"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem(i, j)}
                      className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem(i)}
                  className="text-xs text-brand hover:underline flex items-center gap-1 mt-1"
                >
                  <Plus className="h-3 w-3" /> Add item
                </button>
              </div>
            )}

            {/* ── Quote ── */}
            {block.type === "quote" && (
              <div className="space-y-2">
                <textarea
                  value={block.content ?? ""}
                  onChange={(e) => updateBlock(i, { content: e.target.value })}
                  placeholder="Quote text..."
                  rows={2}
                  className="w-full text-sm text-foreground placeholder:text-muted-foreground bg-transparent border-0 resize-none focus:outline-none italic leading-relaxed"
                />
                <Input
                  value={block.author ?? ""}
                  onChange={(e) => updateBlock(i, { author: e.target.value })}
                  placeholder="Author name (optional)"
                  className="text-sm h-9"
                />
              </div>
            )}

            {/* ── Code ── */}
            {block.type === "code" && (
              <div className="space-y-2">
                <Input
                  value={block.language ?? ""}
                  onChange={(e) => updateBlock(i, { language: e.target.value })}
                  placeholder="Language (e.g. javascript, php, bash...)"
                  className="text-sm h-9"
                />
                <textarea
                  value={block.content ?? ""}
                  onChange={(e) => updateBlock(i, { content: e.target.value })}
                  placeholder="// paste your code here..."
                  rows={6}
                  className="w-full text-sm font-mono text-foreground placeholder:text-muted-foreground bg-muted/30 rounded-lg p-3 border border-input resize-y focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
            )}

          </div>
        </div>
      ))}

      {/* Add block */}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowPicker(!showPicker)}
          className="w-full gap-2 rounded-xl border-dashed text-sm h-10"
        >
          <Plus className="h-4 w-4" />
          Add Block
        </Button>

        {showPicker && (
          <div className="mt-3 bg-background border border-border rounded-xl shadow-lg p-3 ">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Choose block type</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border border-border hover:border-brand/30 hover:bg-brand/5 transition-colors"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}