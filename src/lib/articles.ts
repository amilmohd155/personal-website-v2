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

type ContentType = "blog" | "devlog" | "stories" | "project";

interface ContentMetadata {
  author: string;
  date: string;
  summary: string;
  title: string;
}

interface DevlogMetadata {
  index: number;
}

interface ProjectMetadata {
  demo: string;
  repository: string;
}

export interface ArticleMetadata
  extends ContentMetadata,
    Partial<DevlogMetadata>,
    Partial<ProjectMetadata> {
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
  published: boolean;
  content?: {
    mdx: string;
    html: string;
  };
}

const getPath = (contentType: ContentType, collection?: string) => {
  switch (contentType) {
    case "blog":
      return {
        path: config.blogDirectory,
        relativePath: "blog",
      };

    case "devlog":
      if (!collection) {
        throw new Error("Collection name is required for devlog articles");
      }
      return {
        path: `${config.devlogDirectory}/${collection}`,
        relativePath: `devlog/${collection}`,
      };
    case "stories":
      return {
        path: config.storyDirectory,
        relativePath: "stories",
      };
    case "project":
      return {
        path: config.projectDirectory,
        relativePath: "projects",
      };
  }
};

export const retrieveArticleData = async (
  contentType: ContentType,
  collection?: string,
) => {
  if (contentType === "devlog" && !collection) {
    throw new Error("Collection name is required for devlog articles");
  }

  const metadata = [];

  const { path, relativePath } = getPath(contentType, collection);

  const directory = join(process.cwd(), path);

  const files = await readdir(directory, {
    withFileTypes: true,
  });

  const mdxFiles = files.filter(
    (file) => file.isFile() && file.name.endsWith(".mdx"),
  );

  for await (const file of mdxFiles) {
    const filePath = join(directory, file.name);

    metadata.push(
      await extractArticleMetadata(filePath, file.name, relativePath),
    );
  }

  return metadata;
};

async function extractArticleMetadata(
  filePath: string,
  fileName: string,
  relativePath: string,
): Promise<ArticleMetadata> {
  const slug = slugify(fileName.replace(/\.mdx$/, ""));

  const content = await import(`@/content/${relativePath}/${fileName}`);
  const stats = await stat(filePath);

  return {
    id: randomUUID(),
    slug,
    index: content.metadata.index,
    href: `${relativePath}/${slug}`,
    author: config.author,
    category: content.metadata.category || "Uncategorized",
    tags: content.metadata.tags || [],
    date: content.metadata.date,
    title: content.metadata.title,
    summary: content.metadata.summary,
    published: content.metadata.published ?? true,
    fileName,
    filePath,
    createdAt: new Date(stats.ctime).toISOString(),
    updatedAt: new Date(stats.mtime).toISOString(),
    readTime: getReadTime(filePath),
    demo: content.metadata.demo,
    repository: content.metadata.repository,
  };
}

export const getArticles = memoize(
  async (contentType: ContentType = "blog", collection?: string) =>
    retrieveArticleData(contentType, collection),
);

export const getLatestArticles = memoize(
  async (contentType: ContentType, collection?: string) =>
    (await getArticles(contentType, collection))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 3),
);

export const getArticleBySlug = memoize(
  async (
    slug: string,
    contentType: ContentType = "blog",
    collection?: string,
  ) => {
    const article = (await getArticles(contentType, collection)).find(
      (entry) => entry.slug === slug,
    );
    if (!article) {
      throw new Error(`Article with slug ${slug} not found`);
    }

    return article;
  },
);

export const getFilteredSortedArticles = memoize(
  async (
    filter: string,
    contentType: ContentType = "blog",
    collection?: string,
  ) => {
    const articles = await getArticles(contentType, collection);

    const sortedArticles = articles.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const filteredArticles = sortedArticles.filter((article) => {
      return filter === "All" ? true : article.category === filter;
    });

    return filteredArticles;
  },
);
