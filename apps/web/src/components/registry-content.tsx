"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { SkillCard } from "@/components/skill-card";
import type { Skill } from "@/db/schema";

type ScoredSkill = Skill & { relevance?: number };

export function RegistryContent({
  initialSkills,
  categories,
}: {
  initialSkills: Skill[];
  categories: { value: string; label: string; icon: string }[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [results, setResults] = useState<ScoredSkill[] | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const search = useCallback(
    async (q: string, category: string) => {
      const hasQuery = q.trim().length > 0;
      const hasCategory = category !== "all";

      if (!hasQuery && !hasCategory) {
        setResults(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (hasQuery) params.set("q", q.trim());
        if (hasCategory) params.set("category", category);
        const res = await fetch(`/api/skills?${params.toString()}`);
        const data = await res.json();
        setResults(data.data ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const debouncedSearch = useCallback(
    (q: string, category: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => search(q, category), 300);
    },
    [search]
  );

  useEffect(() => {
    debouncedSearch(query, activeCategory);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, activeCategory, debouncedSearch]);

  const displayedSkills = results ?? initialSkills;

  return (
    <>
      {/* Search */}
      <div className="relative mb-6">
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
          placeholder='Search CLIs... e.g. "schedule tweets" or "send emails"'
          className="h-12 rounded-xl border-border bg-card/60 pl-10 text-base placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
            activeCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              activeCategory === cat.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-6">
        {displayedSkills.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 py-20 text-center">
            <div className="text-4xl">🔍</div>
            <p className="mt-4 font-mono text-sm text-muted-foreground">
              No CLIs found{query ? ` for "${query}"` : ""}
            </p>
            {query && (
              <p className="mt-2 text-sm text-muted-foreground">
                This CLI doesn&apos;t exist yet. Be the first to create it!
              </p>
            )}
            <pre className="mx-auto mt-4 inline-block rounded-xl bg-muted px-5 py-3 font-mono text-xs text-muted-foreground">
              npx api2cli create{" "}
              {query
                ? query.split(" ")[0]?.toLowerCase() ?? "my-api"
                : "my-api"}
            </pre>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
