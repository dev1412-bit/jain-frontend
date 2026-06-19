import type { ContentBlock } from "@/store/blogStore";
import Image from "next/image";

type Props = { blocks: ContentBlock[] };

export default function RenderContent({ blocks }: Props) {
  if (!blocks?.length) return null;

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {

          case "heading": {
            const level = block.level ?? 2;
            const cls =
              level === 2 ? "text-2xl font-bold text-foreground mt-10 mb-2" :
              level === 3 ? "text-xl font-semibold text-foreground mt-8 mb-2" :
                            "text-lg font-semibold text-foreground mt-6 mb-1";
            if (level === 2) return <h2 key={i} className={cls}>{block.content}</h2>;
            if (level === 3) return <h3 key={i} className={cls}>{block.content}</h3>;
            return <h4 key={i} className={cls}>{block.content}</h4>;
          }

          case "paragraph":
            return (
              <p key={i} className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {block.content}
              </p>
            );

          case "image":
            return (
              <figure key={i} className="my-6">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={block.url || "https://placehold.co/800x450/f5f0f7/d4006e?text=Image"}
                    alt={block.alt || ""}
                    fill
                    sizes="(max-width:768px) 100vw, 768px"
                    className="object-cover"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-xs text-center text-muted-foreground mt-2">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "list":
            return (
              <ul
                key={i}
                className={`pl-5 space-y-1.5 ${
                  block.style === "ordered" ? "list-decimal" : "list-disc"
                }`}
              >
                {block.items?.map((item, j) => (
                  <li key={j} className="text-sm text-muted-foreground leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-4 border-brand pl-5 py-1 my-4 bg-brand/5 rounded-r-lg"
              >
                <p className="text-sm text-foreground italic leading-relaxed">
                  &ldquo;{block.content}&rdquo;
                </p>
                {block.author && (
                  <cite className="text-xs text-brand mt-1.5 block font-medium not-italic">
                    — {block.author}
                  </cite>
                )}
              </blockquote>
            );

          case "code":
            return (
              <div key={i} className="relative">
                {block.language && (
                  <div className="flex items-center justify-between bg-muted border border-border rounded-t-xl px-4 py-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {block.language}
                    </span>
                  </div>
                )}
                <pre
                  className={`bg-muted/50 border border-border px-4 py-4 overflow-x-auto text-sm font-mono text-foreground ${
                    block.language ? "rounded-b-xl border-t-0" : "rounded-xl"
                  }`}
                >
                  <code>{block.content}</code>
                </pre>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}