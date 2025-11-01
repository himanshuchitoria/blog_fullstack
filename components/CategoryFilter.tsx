"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

type CategoryFilterProps = {
  categories: string[]; // e.g., ["All", "General", "Tech", "AWS"]
  value?: string; // current selected category; defaults from URL ?category=
  onChange?: (category: string) => void; // optional callback for parent state
  paramKey?: string; // URL search param key, default "category"
  className?: string;
};

export function CategoryFilter({
  categories,
  value,
  onChange,
  paramKey = "category",
  className,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected =
    value ??
    (searchParams.get(paramKey) && searchParams.get(paramKey)!.length > 0
      ? searchParams.get(paramKey)!
      : "All");

  const handleChange = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "All") {
      params.delete(paramKey);
    } else {
      params.set(paramKey, next);
    }
    router.replace(`?${params.toString()}`);
    onChange?.(next);
  };

  return (
    <div className={className}>
      <label htmlFor="category-filter" className="sr-only">
        Category
      </label>
      <select
        id="category-filter"
        className="rounded-md px-3 py-2 text-black"
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
