import { GithubIcon } from "@/components/brand-icons";
import { Mail, PenTool, ScrollText } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { config } from "./config";

type NavIconItem = {
  title: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;
};

const navIconItems: NavIconItem[] = [
  {
    title: "Devlog",
    href: "/devlog",
    icon: ScrollText,
  },
  {
    title: "Stories",
    href: "/stories",
    icon: PenTool,
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Mail,
  },
  {
    title: "Github",
    href: config.repository,
    icon: GithubIcon,
  },
];
export { navIconItems };
