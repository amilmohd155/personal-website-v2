import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { defineConfig, defineCollection, s } from "velite";
import rehypePrettyCode from "rehype-pretty-code";

const readTime = (raw: string) => {
  if (!raw) return "0 min read";
  const wordCount = raw.split(/\s+/).length;
  return `${Math.ceil(wordCount / 200)} min read`; // Assuming average reading speed of 200 words per minute
};

const slugify = (input: string) =>
  input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const blogs = defineCollection({
  name: "blogs",
  pattern: "blog/*.mdx",

  schema: s
    .object({
      title: s.string(),
      summary: s.string(),
      date: s.isodate(),
      category: s.string(),
      tags: s.array(s.string()),
      published: s.boolean().default(false),
      body: s.mdx(),
      toc: s.toc(),
      raw: s.raw(),
      readTime: s.raw().transform(readTime),
    })
    .transform((data) => {
      const slug = slugify(data.title);

      return {
        ...data,
        slug,
        permalink: `/blog/${slug}`,
      };
    }),
});

const devlog = defineCollection({
  name: "devlog",
  pattern: "devlog/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      summary: s.string(),
      date: s.isodate(),
      category: s.string(),
      collection: s.string(),
      index: s.number(),
      tags: s.array(s.string()),
      published: s.boolean().default(false),
      body: s.mdx(),
      toc: s.toc(),
      readTime: s.raw().transform(readTime),
    })
    .transform((data) => {
      const slug = slugify(data.title);

      return {
        ...data,
        slug,
        permalink: `/devlog/${data.collection}/${slug}`,
      };
    }),
});

const devlogCollections = defineCollection({
  name: "devlogCollections",
  pattern: "devlog/collections.yml",
  single: true,
  schema: s.object({
    collections: s.array(
      s.object({
        name: s.string(),
        description: s.string().optional(),
      }),
    ),
  }),
});

const projects = defineCollection({
  name: "projects",
  pattern: "projects/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      category: s.string(),
      summary: s.string(),
      date: s.isodate(),
      tags: s.array(s.string()),
      repository: s.string().url().optional(),
      demo: s.string().url().optional(),
      body: s.mdx(),
    })
    .transform((data) => {
      const slug = slugify(data.title);
      return {
        ...data,
        slug,
        permalink: `/projects/${slug}`,
      };
    }),
});

const stories = defineCollection({
  name: "stories",
  pattern: "stories/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      summary: s.string(),
      date: s.isodate(),
      body: s.mdx(),
      readTime: s.raw().transform(readTime),
    })
    .transform((data) => {
      const slug = slugify(data.title);
      return {
        ...data,
        slug,
        permalink: `/stories/${slug}`,
      };
    }),
});

const pages = defineCollection({
  name: "page",
  pattern: "pages/*.mdx",
  schema: s.object({
    slug: s.path().transform((val) => val.split("/")[1]),
    body: s.mdx(),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    clean: true,
  },
  collections: {
    blogs,
    devlog,
    devlogCollections,
    projects,
    stories,
    pages,
  },
  mdx: {
    // remarkPlugins: {},
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["decoration-[none]"],
          },
        },
      ],
      [
        rehypePrettyCode,
        {
          grid: true,
          theme: {
            dark: "ayu-dark",
            light: "github-light",
          },

          defaultLang: "plaintext",
        },
      ],
    ],
  },
});
