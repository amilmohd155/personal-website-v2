import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export function Page({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <main
      className={cn(
        "min-h-screen w-full mx-auto bg-background text-foreground flex flex-col",
        "max-w-[70ch]",
        className
      )}
    >
      {children}
    </main>
  );
}

function Section({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <section className={cn("flex-1 px-4 md:px-6 py-6 md:py-12", className)}>
      {children}
    </section>
  );
}

function Heading({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <h1 className={cn("text-3xl md:text-4xl font-medium mb-6", className)}>
      {children}
    </h1>
  );
}

Page.Section = Section;
Page.Heading = Heading;
