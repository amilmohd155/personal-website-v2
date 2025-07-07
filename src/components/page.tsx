import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export function Page({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <main
      className={cn(
        "bg-background text-foreground mx-auto flex min-h-[80vh] w-full flex-col",
        "max-w-[80ch]",
        className,
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
    <section className={cn("flex-1 px-4 py-6 md:px-6 md:py-12", className)}>
      {children}
    </section>
  );
}

function Heading({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <h1 className={cn("mb-6 text-3xl font-medium md:text-4xl", className)}>
      {children}
    </h1>
  );
}

Page.Section = Section;
Page.Heading = Heading;
