"use client";

import Link from "next/link";
import * as LucideReact from "lucide-react";
import { JSX } from "react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { LinkHandler } from "./link-handler";
import { config } from "@/lib/config";
import { AnimatedLogo } from "./animated-logo";
import { MobileNav } from "./mobile-nav";
import { navIconItems } from "@/lib/header";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathName = usePathname();

  return (
    <header className="px-3 py-6 md:px-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-wider">
          {/* / me / */}
          <AnimatedLogo />
        </Link>
        <span className="flex items-center justify-end gap-4">
          <nav className="hidden items-center gap-4 md:flex">
            {config.sections.map((section) => {
              const isActive =
                pathName.split("/")[1] === section.name.toLowerCase();
              return (
                <LinkHandler
                  key={section.name}
                  href={`/${section.name.toLowerCase()}`}
                  title={section.name}
                  className={cn(
                    "text-muted-foreground hover:text-foreground text-sm tracking-wide capitalize",
                    isActive && "text-foreground",
                  )}
                >
                  {section.name}
                </LinkHandler>
              );
            })}
          </nav>
          <div className="hidden items-center md:flex">
            {navIconItems.map((item) => {
              const Icon = LucideReact[item.icon] as JSX.ElementType;

              const isActive =
                pathName.split("/")[1] === item.href.split("/")[1];

              return (
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  key={item.title}
                  aria-label={item.title}
                  className={cn(
                    "text-muted-foreground px-0",
                    isActive && "text-foreground",
                  )}
                >
                  <LinkHandler href={item.href} title={item.title}>
                    <Icon strokeWidth={1.5} />
                    <span className="sr-only">{item.title}</span>
                  </LinkHandler>
                </Button>
              );
            })}
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
          <MobileNav />
        </span>
      </div>
    </header>
  );
}
