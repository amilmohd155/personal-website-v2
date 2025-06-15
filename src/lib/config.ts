export const config = {
  author: "Amil Muhammed Hamza",
  title: "Full-Stack Development & Technical Blogging Portfolio",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  description:
    "A digital space for building and storytelling — blending full-stack web and mobile development with original short stories. Featuring projects, technical insights, and narrative experiments crafted with code and creativity.",
  blogDirectory: "src/content/blog",
  devlogDirectory: "src/content/devlog",
  projectDirectory: "src/content/projects",
  storyDirectory: "src/content/stories",
  artDirectory: "src/content/art",
  repository: "https://github.com/amilmohd155/personal-website-v2",
  resumeUrl:
    "https://cufknazmgyuxwsd4.public.blob.vercel-storage.com/Amil_Resume-lBBdbIaVpcMXifgtXhKl5XOk1wl9QH.pdf",
  license: {
    name: "MIT",
    url: "https://opensource.org/license/mit/",
  },
  collections: ["quizcript"],
  sections: [
    {
      name: "Blog",
    },

    {
      name: "Projects",
    },
  ],
  githubUrl: "https://github.com/amilmohd155",
  email: "amilmohd155@gmail.com",
  linkedInUrl: "https://www.linkedin.com/in/amil-muhammed/",
  twitter: {
    handle: "@amilmohd155",
    url: "https://x.com/amilmohd155",
  },
};
