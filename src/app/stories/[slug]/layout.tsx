import { Page } from "@/components/page";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Page>
      <Page.Section>
        {/* ScrollToHash */}
        <article className="prose dark:prose-invert prose-p:text-muted-foreground max-w-none min-w-full">
          {children}
        </article>
        {/* Footer */}
        {/* Floater */}
      </Page.Section>
    </Page>
  );
}
