import { Page } from "@/components/page";
import {
  AppList,
  SectionHeading,
  developmentApps,
  liveApps,
} from "@/components/app-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apps",
};

// Side-by-side columns (stacked on mobile)
export default function AppsPage() {
  return (
    <Page className="max-w-5xl">
      <Page.Section>
        <Page.Heading>Apps</Page.Heading>
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <section>
            <SectionHeading count={liveApps.length}>Live</SectionHeading>
            <AppList items={liveApps} />
          </section>
          <section>
            <SectionHeading count={developmentApps.length}>
              Under development
            </SectionHeading>
            <AppList items={developmentApps} />
          </section>
        </div>
      </Page.Section>
    </Page>
  );
}
