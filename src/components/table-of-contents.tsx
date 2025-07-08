"use client";

import { LinkHandler } from "./link-handler";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

type TocEntry = {
  title: string;
  url: string;
  items: TocEntry[];
};

interface TocProps {
  toc: TocEntry[];
}

function TableOfContents({ toc }: TocProps) {
  return (
    <div className="border-border prose-a:no-underline prose-ul:list-outside border-b">
      <Accordion type="single" collapsible>
        <AccordionItem value="table-of-contents">
          <AccordionTrigger className="!hover:no-underline cursor-pointer tracking-wider uppercase">
            Contents
          </AccordionTrigger>
          <AccordionContent>
            <Tree items={toc} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

interface TreeProps {
  items: TocEntry[];
  level?: number;
  activeItem?: string;
}

function Tree({ items, level = 1, activeItem }: TreeProps) {
  return items.length && level < 3 ? (
    <ul className="!space-y-5">
      {items.map((item, index) => (
        <li key={index}>
          <LinkHandler
            className="hover:text-muted-foreground transition-colors duration-100"
            href={item.url}
          >
            {item.title}
          </LinkHandler>
          {item.items.length ? (
            <Tree
              items={item.items}
              level={level + 1}
              activeItem={activeItem}
            />
          ) : null}
        </li>
      ))}
    </ul>
  ) : null;
}

export default TableOfContents;
