"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { SearchResults } from "./search-results";
import type { Skill } from "@/db/schema";

type ScoredSkill = Skill & { relevance?: number };

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ScoredSkill[] | null>(null);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/skills?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.data ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="relative mx-auto max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg
              className="h-5 w-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Input
            type="text"
            placeholder='Describe what you need... e.g. "schedule tweets and track analytics"'
            className="h-14 rounded-2xl border-border/80 bg-card pl-12 pr-28 text-base shadow-lg shadow-black/5 placeholder:text-muted-foreground/60 focus-visible:ring-primary/30"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 rounded-xl bg-primary px-5 font-mono text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>
      </form>

      {results !== null && (
        <SearchResults results={results} query={query} />
      )}
    </div>
  );
}
