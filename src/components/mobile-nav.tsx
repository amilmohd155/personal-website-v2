"use client";
import { MenuIcon, XIcon } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { useState } from "react";
import { config } from "@/lib/config";
import Link from "next/link";
import { LinkHandler } from "./link-handler";
import * as LucideReact from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const NavItems: { title: string; href: string }[] = [
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Projects",
    href: "/projects",
  },
  {
    title: "Devlog",
    href: "/devlog",
  },
  {
    title: "Stories",
    href: "/stories",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export const MobileNav = () => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <div className="md:hidden">
      <Drawer open={open} onOpenChange={handleOpenChange} direction="left">
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground h-8 gap-4 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            {open ? (
              <XIcon strokeWidth={1.625} />
            ) : (
              <MenuIcon strokeWidth={1.625} />
            )}
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-0">
          <DrawerTitle className="sr-only">Menu</DrawerTitle>
          <DrawerDescription />
          <nav className="flex h-full flex-col justify-between pt-10">
            <ul className="flex flex-col items-start p-4">
              {NavItems.map((item) => (
                <DrawerClose key={item.title} asChild>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start py-2"
                  >
                    <Link href={item.href} title={item.title}>
                      <li className="text-muted-foreground text-sm tracking-wide capitalize">
                        {item.title}
                      </li>
                    </Link>
                  </Button>
                </DrawerClose>
              ))}
            </ul>
            <div className="flex w-full items-center justify-between p-4">
              <Button
                asChild
                variant="ghost"
                size="icon"
                aria-label="Github"
                className="text-muted-foreground px-0"
              >
                <LinkHandler href={config.repository} title="Github">
                  <LucideReact.Github strokeWidth={1.5} />
                  <span className="sr-only">Github</span>
                </LinkHandler>
              </Button>
              <ThemeToggle />
            </div>
          </nav>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
