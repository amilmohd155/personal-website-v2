"use client";

import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  console.error("Error:", error);

  return (
    <Page>
      <div className="m-auto flex min-h-[75vh] items-center px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full space-y-6 text-center">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tighter md:text-5xl">
              Looks like our server didn&apos;t get the memo about that version.
              🗒️
            </h1>
            <pre>500 Internal Server Error</pre>
            <div className="flex justify-center space-x-3">
              <Button asChild variant="ghost">
                <Link href="/">
                  <ArrowLeft />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" onClick={() => reset()}>
                <RefreshCw />
                Reload
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
