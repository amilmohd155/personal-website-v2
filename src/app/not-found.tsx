"use client";

import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Page>
      <div className="m-auto flex min-h-[75vh] items-center px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full space-y-6 text-center">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tighter md:text-5xl">
              The resource you&apos;re looking for doesn&apos;t exist or has
              been moved. 🔍
            </h1>
            <pre> 404 — Page Not Found</pre>
            <div className="flex justify-center space-x-3">
              <Button asChild variant="ghost">
                <Link href="/">
                  <ArrowLeft />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" onClick={() => window.location.reload()}>
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
