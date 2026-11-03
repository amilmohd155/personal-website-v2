import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { defineConfig, defineCollection, s } from "velite";
import rehypePrettyCode from "rehype-pretty-code";
import { readdir } from "node:fs/promises";
import { basename, dirname, extname } from "node:path";
import { processAsset } from "velite";

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

const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
]);

// "01-trace-mode.png" -> "Trace mode"
const altFromFilename = (name: string) => {
  const text = name
    .replace(/^\d+[-_.\s]*/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "Screenshot";
};

/**
 * Discover an entry's gallery from its folder: every image except `icon.*` (an
 * app icon, set in frontmatter), sorted by filename, so number files to order
 * them (`01-home.webp`, `02-editor.webp`, ...). Only entries that have their
 * own folder (`<name>/index.mdx`) get one; a lone `<name>.mdx` shares its
 * folder with other entries.
 */
const discoverGallery = async (
  mdxPath: string,
  output: { name: string; base: string },
) => {
  if (basename(mdxPath) !== "index.mdx") return [];
  const dir = dirname(mdxPath);
  const files = (await readdir(dir))
    .filter((file) => IMAGE_EXTENSIONS.has(extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const process = (file: string) =>
    processAsset(`./${file}`, mdxPath, output.name, output.base, true);

  const galleryFiles = files.filter(
    (file) => basename(file, extname(file)) !== "icon",
  );

  return Promise.all(
    galleryFiles.map(async (file) => ({
      ...(await process(file)),
      alt: altFromFilename(basename(file, extname(file))),
    })),
  );
};

type EntryMeta = {
  path: string;
  config: { output: { name: string; base: string } };
};

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
    .transform(async (data, { meta }) => {
      const slug = slugify(data.title);
      return {
        ...data,
        slug,
        permalink: `/projects/${slug}`,
        gallery: await discoverGallery(
          (meta as EntryMeta).path,
          (meta as EntryMeta).config.output,
        ),
      };
    }),
});

const apps = defineCollection({
  name: "apps",
  pattern: "apps/**/*.mdx",
  schema: s
    .object({
      slug: s.path().transform((val) => val.split("/")[1]),
      title: s.string(),
      summary: s.string().max(120),
      stage: s.enum(["live", "development"]),
      order: s.number().default(100),
      platforms: s.array(s.string()).default([]),
      icon: s.image().optional(),
      website: s.string().url().optional(),
      appStore: s.string().url().optional(),
      playStore: s.string().url().optional(),
      body: s.mdx(),
    })
    .transform(async (data, { meta }) => ({
      ...data,
      permalink: `/apps/${data.slug}`,
      // Velite passes the source file and config here, as its own s.image() uses.
      gallery: await discoverGallery(
        (meta as EntryMeta).path,
        (meta as EntryMeta).config.output,
      ),
    })),
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
    apps,
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
