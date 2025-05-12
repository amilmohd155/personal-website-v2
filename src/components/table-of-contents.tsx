"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const DELAY = 200;
const MAX_ATTEMPTS = 10;

export function TableOfContents({}) {
  const [isOpen, setIsOpen] = useState(false);
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);

  useEffect(() => {
    let attempts = 0;
    const checkForHeadings = () => {
      const article = document.querySelector("article");
      if (!article) return;

      const headingElements = article.querySelectorAll("h2, h3");
      if (headingElements.length > 0) {
        const headingsData = Array.from(headingElements).map((heading) => ({
          id: heading.id,
          text: heading.textContent || "",
          level: heading.tagName === "H2" ? 2 : 3,
        }));

        setHeadings(headingsData);
      } else if (attempts < MAX_ATTEMPTS) {
        attempts++;
        setTimeout(checkForHeadings, DELAY);
      }
    };

    checkForHeadings();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="border-border border-b">
      <Button
        className="w-full cursor-pointer justify-between px-0!"
        variant="link"
        size="lg"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-xs tracking-widest uppercase">Contents</span>
        {isOpen ? (
          <ChevronUp className="size-4" />
        ) : (
          <ChevronDown className="size-4" />
        )}
      </Button>
      {isOpen && (
        <nav className="mt-4">
          <ul className="list-none space-y-2 ps-0">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={cn("p-0", heading.level === 3 ? "ml-4" : "")}
              >
                <a
                  href={`#${heading.id}`}
                  className="text-sm font-normal text-gray-500 no-underline hover:text-gray-300 dark:text-gray-400"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
