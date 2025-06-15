import type { Metadata } from "next";

import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cn } from "@/lib/utils";
import { fontVariables } from "@/lib/fonts";
import { ThemeProvider } from "next-themes";
import { unstable_ViewTransition as ViewTransistion } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(config.baseUrl),
  // title: {
  //   default: config.author,
  //   template: `%s | ${config.author}`,
  // },
  title: config.title,
  authors: [{ name: config.author, url: config.githubUrl }],
  creator: config.author,
  keywords: ["Portfolio", "Blog", "Devlog"],
  description: config.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", fontVariables)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
        >
          <ViewTransistion>
            <Header />
            {children}
            <Footer />
          </ViewTransistion>

          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
