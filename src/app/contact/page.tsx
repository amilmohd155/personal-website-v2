import { ContactLayout, LinkGroup } from "@/components/contact-layout";
import { MDXContent } from "@/components/mdx-content";
import { pages } from "@content";
import { notFound } from "next/navigation";

export default function Page() {
  const contactPage = pages.find((page) => page.slug === "contact");

  if (!contactPage) {
    return notFound;
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
