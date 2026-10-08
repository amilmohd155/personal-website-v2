import { cacheLife } from "next/cache";

import { config } from "@/lib/config";
import { cn } from "@/lib/utils";
import { LinkHandler } from "./link-handler";

export function Footer() {
  return (
    <footer className={cn("text-muted-foreground px-8 py-6")}>
      <div className="flex flex-row items-start justify-between gap-6 md:items-center">
        <div className="flex flex-col gap-2 text-xs tracking-widest uppercase sm:flex-row">
          <a href={config.license.url}>{config.license.name}</a>
          <span className="hidden sm:flex">
            <CurrentYear /> - Present © {config.author}
          </span>
        </div>
        <nav className="flex gap-6 text-xs tracking-widest uppercase">
          <LinkHandler href={config.githubUrl}>Github</LinkHandler>
          <LinkHandler href={config.twitter.url}>X</LinkHandler>
          <LinkHandler href={config.linkedInUrl}>LinkedIn</LinkHandler>
        </nav>
      </div>
    </footer>
  );
}

// Cached so the footer stays part of the prerendered static shell.
async function CurrentYear() {
  "use cache";
  cacheLife("days");

  return new Date().getFullYear();
}
