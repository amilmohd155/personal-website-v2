"use client";
import { Check, CopyIcon } from "lucide-react";
import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";

const COOLDOWN_MS = 2000;

export function CodeBlock({
  ...props
}: ComponentPropsWithoutRef<"code"> & { "data-sh-language"?: string }) {
  const codeRef = useRef<HTMLElement>(null);
  const language = props["data-sh-language"] ?? "plaintext";

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(codeRef.current.innerText);
      setCopied(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, COOLDOWN_MS);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (language === "plaintext") {
    return <code {...props} />;
  }

  return (
    <>
      <div className="bg-muted flex items-center justify-between px-4 py-2 text-xs">
        <span className="font-mono uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex cursor-pointer flex-row items-center gap-x-2 opacity-50 transition-all duration-200 ease-in-out hover:opacity-100 active:scale-95 active:opacity-50"
          aria-label="Copy code"
        >
          {copied ? "Copied!" : "Copy"}
          <span className="sr-only">Copy code</span>
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </button>
      </div>
      <pre className="relative m-0! me-2! overflow-x-auto bg-transparent text-sm">
        <code ref={codeRef} {...props} />
      </pre>
    </>
  );
}
