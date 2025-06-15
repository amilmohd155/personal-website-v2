import type { MDXComponents } from "mdx/types";
import { ComponentPropsWithoutRef } from "react";

import { CodeBlock } from "./components/code-block";
import { LinkHandler } from "./components/link-handler";
import Image, { ImageProps } from "next/image";
import { cn } from "./lib/utils";

export function useMDXComponents(): MDXComponents {
  return {
    h1: (props: ComponentPropsWithoutRef<"h1">) => (
      <h1
        className="not-prose mb-6 text-3xl leading-tight font-bold tracking-tight text-[var(--tw-prose-headings)] md:text-5xl"
        {...props}
      />
    ),
    h2: (props: ComponentPropsWithoutRef<"h2">) => (
      <h2
        className="not-prose not-prose mt-12 mb-4 text-2xl font-bold text-[var(--tw-prose-headings)]"
        {...props}
      />
    ),
    h3: (props: ComponentPropsWithoutRef<"h3">) => (
      <h3
        className="not-prose mt-8 mb-3 font-semibold text-[var(--tw-prose-headings)]"
        {...props}
      />
    ),
    h4: (props: ComponentPropsWithoutRef<"h4">) => (
      <h4
        className="not-prose mt-6 mb-3 font-semibold text-[var(--tw-prose-headings)]"
        {...props}
      />
    ),
    h5: (props: ComponentPropsWithoutRef<"h5">) => (
      <div
        className="not-prose text-muted-foreground my-1 text-xs tracking-widest uppercase"
        {...props}
      />
    ),
    h6: (props: ComponentPropsWithoutRef<"h6">) => (
      <p className="not-prose text-muted-foreground my-1 text-sm" {...props} />
    ),
    p: (props: ComponentPropsWithoutRef<"p">) => (
      <p className="prose-p:text-foreground mb-8 leading-relaxed" {...props} />
    ),
    ol: (props: ComponentPropsWithoutRef<"ol">) => (
      <ol className="list-decimal space-y-2 pl-5" {...props} />
    ),
    ul: (props: ComponentPropsWithoutRef<"ul">) => (
      <ul className="list-disc space-y-1 pl-5" {...props} />
    ),
    li: (props: ComponentPropsWithoutRef<"li">) => (
      <li className="pl-1" {...props} />
    ),
    em: (props: ComponentPropsWithoutRef<"em">) => (
      <em className="font-medium" {...props} />
    ),
    strong: (props: ComponentPropsWithoutRef<"strong">) => (
      <strong className="font-medium" {...props} />
    ),
    a: (props: ComponentPropsWithoutRef<"a">) => (
      <LinkHandler underline {...props} />
    ),
    code: CodeBlock,
    pre: ({ className, ...props }: ComponentPropsWithoutRef<"pre">) => (
      <pre
        className={cn(
          "relative overflow-x-hidden rounded-lg border p-0",
          className,
        )}
        {...props}
      />
    ),

    Table: ({ data }: { data: { headers: string[]; rows: string[][] } }) => (
      <table>
        <thead>
          <tr>
            {data.headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ),
    blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote
        className="ml-[0.075em] border-l-3 border-gray-300 pl-4 tracking-wide text-gray-600 dark:border-zinc-600 dark:text-zinc-300"
        {...props}
      />
    ),
    img: (props: ComponentPropsWithoutRef<"img">) => (
      <Image
        {...(props as ImageProps)}
        alt={props.alt || "Image"}
        sizes="100vw"
        width={500}
        height={500}
        style={{ width: "100%", height: "auto" }}
      />
    ),
  };
}
