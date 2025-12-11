import { ContactLayout, LinkGroup } from "@/components/contact-layout";
import { MDXContent } from "@/components/mdx-content";
import { pages } from "@content";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage(props: PageProps<"/contact">) {
  const contactPage = pages.find((page) => page.slug === "contact");

  if (!contactPage) {
    notFound();
  }

  return (
    <ContactLayout>
      <MDXContent
        code={contactPage.body}
        components={{
          LinkGroup,
        }}
      />
    </ContactLayout>
  );
}
