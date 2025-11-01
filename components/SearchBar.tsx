"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type SearchBarProps = {
  placeholder?: string;
  paramKey?: string; // default "q"
  className?: string;
  debounceMs?: number; // default 300
  autoFocus?: boolean;
};

export function SearchBar({
  placeholder = "Search posts...",
  paramKey = "q",
  className,
  debounceMs = 300,
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get(paramKey) ?? "";
  const [value, setValue] = useState(initial);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  const commit = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.trim().length === 0) params.delete(paramKey);
    else params.set(paramKey, next);
    router.replace(`?${params.toString()}`);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => commit(next), debounceMs);
  };

  const clear = () => {
    setValue("");
    commit("");
  };

  return (
    <div className={className}>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="flex items-center gap-2">
        <input
          id="search"
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="rounded-md px-3 py-2 text-black w-72"
        />
        {value && (
          <button
            type="button"
            className="text-xs border border-gray-400 rounded px-2 py-1 hover:bg-gray-200"
            onClick={clear}
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
