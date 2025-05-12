import { cn } from "@/lib/utils";
import Link from "next/link";
import * as LucideReact from "lucide-react";
import { JSX } from "react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { LinkHandler } from "./link-handler";
import { config } from "@/lib/config";

// const sections = [
//   {
//     name: "Blog",
//   },
//   {
//     name: "Projects",
//   },
// ];

type NavIconItem = {
  title: string;
  href: string;
  icon: keyof typeof LucideReact;
};

const navIconItems: NavIconItem[] = [
  {
    title: "Skills",
    href: "/skills",
    icon: "Code",
  },
  {
    title: "Stories",
    href: "/stories",
    icon: "PenTool",
  },
  {
    title: "Art",
    href: "/art",
    icon: "Image",
  },
  {
    title: "Contact",
    href: "/contact",
    icon: "Mail",
  },
  {
    title: "Github",
    href: "",
    icon: "Github",
  },
];

export function Header() {
  return (
    <header className="px-4 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight uppercase">
          AM
        </Link>
        <span className="flex items-center justify-end gap-4">
          <nav className="hidden items-center gap-4 md:flex">
            {config.sections.map((section) => (
              <Link
                key={section.name}
                href={`/${section.name.toLowerCase()}`}
                className="text-muted-foreground hover:text-foreground text-sm tracking-wide capitalize"
              >
                {section.name}
              </Link>
            ))}
          </nav>
          <div className="mr-2 flex items-center">
            {navIconItems.map((item) => {
              const Icon = LucideReact[item.icon] as JSX.ElementType;
              return (
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  key={item.title}
                  aria-label={item.title}
                  className="text-muted-foreground px-0"
                >
                  <LinkHandler href={item.href}>
                    <Icon strokeWidth={1.5} />
                    <span className="sr-only">{item.title}</span>
                  </LinkHandler>
                </Button>
              );
            })}
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
          {/* <MobileNav /> */}
        </span>
      </div>
    </header>
  );
}
