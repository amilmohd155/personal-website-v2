import { FileText, Linkedin, Mail, X } from "lucide-react";
import { LinkHandler } from "./link-handler";
import { Page } from "./page";
import { Button } from "./ui/button";
import { config } from "@/lib/config";

export function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <Page>
      <Page.Section>
        <Page.Heading>Get in touch</Page.Heading>
        {children}
      </Page.Section>
    </Page>
  );
}

export const LinkGroup = () => (
  <>
    <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-4">
      <Button asChild variant="outline">
        <LinkHandler
          href="&#109;ai&#108;to&#58;%&#54;1milmohd1&#37;355&#64;gmail&#46;&#99;o&#109;"
          className="not-prose"
        >
          <Mail />
          amil&#109;ohd155&#64;gm&#97;il&#46;com
        </LinkHandler>
      </Button>

      <Button asChild variant="outline">
        <LinkHandler href={config.twitter.url} className="not-prose">
          <X />
          {config.twitter.handle}
        </LinkHandler>
      </Button>
      <Button asChild variant="outline">
        <LinkHandler href={config.linkedInUrl} className="not-prose">
          <Linkedin />
          amil-muhammed
        </LinkHandler>
      </Button>
    </div>
    <br />
  </>
);

export const ResumeButton = () => (
  <Button asChild variant="outline">
    <LinkHandler href={config.resumeUrl} className="not-prose">
      <FileText />
      Resume
    </LinkHandler>
  </Button>
);
