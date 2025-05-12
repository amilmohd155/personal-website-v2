import { randomUUID } from "crypto";
import { memoize } from "./memoize";
import { readFileSync } from "fs";
import { join } from "path";
import { config } from "./config";
import { readdir, stat } from "fs/promises";
import { slugify } from "./utils";

export function getReadTime(filepath: string, wordsPerMinute = 200) {
  const wordsCount = readFileSync(filepath).toString().split(/\s+/).length;
  return `${Math.ceil(wordsCount / wordsPerMinute)} min`;
}

interface ContentMetadata {
  author: string;
  date: string;
  summary: string;
  title: string;
}

export interface ArticleMetadata extends ContentMetadata {
  tags: string[];
  category: string;
  id: string;
  slug: string;
  href: string;
  readTime: string;
  fileName: string;
  filePath: string;
  createdAt: string;
  updatedAt: string;
  content?: {
    mdx: string;
    html: string;
  };
}

export const retrieveArticleData = async () => {
  const metadata = [];

  const directory = join(process.cwd(), config.blogDirectory);

  const files = await readdir(directory, {
    withFileTypes: true,
  });

  const mdxFiles = files.filter(
    (file) => file.isFile() && file.name.endsWith(".mdx"),
  );

  for await (const file of mdxFiles) {
    const filePath = join(directory, file.name);

    metadata.push(await extractArticleMetadata(filePath, file.name, directory));
  }

  return metadata;
};

async function extractArticleMetadata(
  filePath: string,
  fileName: string,
  fileDirectory: string,
): Promise<ArticleMetadata> {
  const slug = slugify(fileName.replace(/\.mdx$/, ""));

  const content = await import(`@/content/blog/${fileName}`);
  const stats = await stat(filePath);

  return {
    id: randomUUID(),
    slug,
    href: `blog/${slug}`,
    author: config.author,
    category: content.metadata.category,
    // date: content.metadata.date,
    title: content.metadata.title,
    summary: content.metadata.summary,
    fileName,
    filePath,
    createdAt: new Date(stats.ctime).toISOString(),
    updatedAt: new Date(stats.mtime).toISOString(),
    readTime: getReadTime(filePath),
  };
}

export const getArticles = memoize(async () => retrieveArticleData());

export const getLatestArticles = memoize(async () =>
  (await getArticles())
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3),
);

export const getArticleBySlug = memoize(async (slug: string) => {
  const article = (await getArticles()).find((entry) => entry.slug === slug);
  if (!article) {
    throw new Error(`Article with slug ${slug} not found`);
  }

  return article;
});
