import { ReactNode } from "react";
import { Page } from "./page";

export function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <Page className="text-muted-foreground">
      <Page.Section>
        <Page.Heading>Welcome</Page.Heading>
        {children}
      </Page.Section>
    </Page>
  );
}
