"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export const CategoryFilter = ({ categories }: { categories: string[] }) => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === "All") {
      params.delete("filter");
    } else {
      params.set("filter", category);
    }
    replace(`${pathName}?${params.toString()}`);
  };

  const selectedFilter = searchParams.get("filter") ?? "All";

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-4 text-sm">
        {categories.map((category) => (
          <Button
            onClick={() => handleCategoryClick(category)}
            key={category}
            variant="link"
            className={cn(
              "p-0 tracking-wider uppercase",
              selectedFilter === category
                ? "text-primary"
                : "text-muted-foreground",
            )}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};
