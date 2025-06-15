"use client";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { useCallback } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="group/toggle text-muted-foreground size-8 cursor-pointer"
      title="Toggle theme"
      onClick={toggleTheme}
    >
      <SunIcon className="hidden [html.dark_&]:block" strokeWidth={1.625} />
      <MoonIcon className="hidden [html.light_&]:block" strokeWidth={1.625} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
