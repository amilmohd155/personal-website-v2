import { Page } from "@/components/page";
import { unstable_ViewTransition as ViewTransition } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition>
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
    </ViewTransition>
  );
}
