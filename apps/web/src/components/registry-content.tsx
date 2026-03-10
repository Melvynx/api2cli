"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { SkillCard } from "@/components/skill-card";
import type { Skill } from "@/db/schema";

type ScoredSkill = Skill & { relevance?: number };
type TagInfo = { tag: string; count: number };

export function RegistryContent({
  initialSkills,
}: {
  initialSkills: Skill[];
  categories?: { value: string; label: string; icon: string }[];
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [results, setResults] = useState<ScoredSkill[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<TagInfo[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch tags dynamically
  useEffect(() => {
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => setTags(data.data ?? []))
      .catch(() => {});
  }, []);

  const search = useCallback(
    async (q: string, tag: string) => {
      const hasQuery = q.trim().length > 0;
      const hasTag = tag !== "all";

      if (!hasQuery && !hasTag) {
        setResults(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (hasQuery) params.set("q", q.trim());
        if (hasTag) params.set("tag", tag);
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
    (q: string, tag: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => search(q, tag), 300);
    },
    [search]
  );

  useEffect(() => {
    debouncedSearch(query, activeTag);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, activeTag, debouncedSearch]);

  const handleTagClick = (tag: string) => {
    setActiveTag(tag === activeTag ? "all" : tag);
  };

  const displayedSkills = results ?? initialSkills;

  const visibleTags = tags;

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

      {/* Tags */}
      {visibleTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag("all")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              activeTag === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            All
          </button>
          {visibleTags.map(({ tag, count }) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                activeTag === tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {tag}
              <span className={`text-[10px] ${activeTag === tag ? "text-primary-foreground/70" : "text-muted-foreground/50"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="mt-6">
        {displayedSkills.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 py-20 text-center">
            <div className="text-4xl">🔍</div>
            <p className="mt-4 font-mono text-sm text-muted-foreground">
              No CLIs found{query ? ` for "${query}"` : ""}
              {activeTag !== "all" ? ` with tag "${activeTag}"` : ""}
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
              <SkillCard key={skill.id} skill={skill} onTagClick={handleTagClick} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
