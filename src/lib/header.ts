import { config } from "./config";
import * as LucideReact from "lucide-react";

type NavIconItem = {
  title: string;
  href: string;
  icon: keyof typeof LucideReact;
};

const navIconItems: NavIconItem[] = [
  {
    title: "Devlog",
    href: "/devlog",
    icon: "ScrollText",
  },
  {
    title: "Stories",
    href: "/stories",
    icon: "PenTool",
  },
  {
    title: "Contact",
    href: "/contact",
    icon: "Mail",
  },
  {
    title: "Github",
    href: config.repository,
    icon: "Github",
  },
];
export { navIconItems };
