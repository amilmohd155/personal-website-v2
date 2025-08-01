import { unstable_ViewTransition as ViewTransition } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ViewTransition>{children}</ViewTransition>;
}
