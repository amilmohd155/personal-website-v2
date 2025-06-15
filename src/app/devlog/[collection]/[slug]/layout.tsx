import { Page } from "@/components/page";
import { unstable_ViewTransition as ViewTransition } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition>
      <Page>
        <Page.Section>
          {/* ScrollToHash */}
          <article className="prose max-w-none dark:prose-invert min-w-full prose-p:text-muted-foreground">
            {children}
          </article>
          {/* Footer */}
          {/* Floater */}
        </Page.Section>
      </Page>
    </ViewTransition>
  );
}
