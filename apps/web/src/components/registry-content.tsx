"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { parseAsString, useQueryStates } from "nuqs";
import { Input } from "@/components/ui/input";
import { SkillCard } from "@/components/skill-card";
import type { Skill } from "@/db/schema";
import type { RegistryCliType } from "@/lib/cli-kind";

type ScoredSkill = Skill & { relevance?: number };
type TagInfo = { tag: string; count: number };

const PAGE_SIZE = 12;

export function RegistryContent({
  initialSkills,
  baseSkills = initialSkills,
  totalCount,
  initialQuery = "",
  initialTag = "all",
  initialType = "all",
  showTypeToggle = false,
}: {
  initialSkills: Skill[];
  baseSkills?: Skill[];
  totalCount?: number;
  initialQuery?: string;
  initialTag?: string;
  initialType?: RegistryCliType;
  showTypeToggle?: boolean;
  categories?: { value: string; label: string; icon: string }[];
}) {
  const [{ query, tag: activeTag, type: activeType }, setFilters] = useQueryStates(
    {
      query: parseAsString.withDefault(""),
      tag: parseAsString.withDefault("all"),
      type: parseAsString.withDefault("all"),
    },
    {
      history: "replace",
      urlKeys: {
        query: "q",
        tag: "tag",
        type: "type",
      },
    },
  );
  const hasInitialFilters =
    initialQuery.trim().length > 0 || initialTag !== "all" || initialType !== "all";
  const matchesInitialFilters =
    query === initialQuery && activeTag === initialTag && activeType === initialType;
  const [results, setResults] = useState<ScoredSkill[] | null>(() =>
    hasInitialFilters && matchesInitialFilters ? initialSkills : null,
  );
  const [loading, setLoading] = useState(
    () => Boolean(query) || activeTag !== "all" || activeType !== "all",
  );
  const [tags, setTags] = useState<TagInfo[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const searchRequestIdRef = useRef(0);

  const [paginatedSkills, setPaginatedSkills] = useState<Skill[]>(baseSkills);
  const [hasMore, setHasMore] = useState(
    totalCount == null ? false : baseSkills.length < totalCount,
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPaginatedSkills(baseSkills);
    setHasMore(totalCount == null ? false : baseSkills.length < totalCount);
    if (hasInitialFilters && matchesInitialFilters) {
      setResults(initialSkills);
      setLoading(false);
    }
  }, [baseSkills, hasInitialFilters, initialSkills, matchesInitialFilters, totalCount]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeType !== "all") params.set("type", activeType);

    fetch(`/api/tags?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setTags(data.data ?? []))
      .catch(() => {});
  }, [activeType]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const params = new URLSearchParams({
        offset: String(paginatedSkills.length),
        limit: String(PAGE_SIZE),
      });
      if (activeType !== "all") params.set("type", activeType);
      const res = await fetch(`/api/skills?${params.toString()}`);
      const data = await res.json();
      const newSkills: Skill[] = data.data ?? [];
      setPaginatedSkills((prev) => [...prev, ...newSkills]);
      setHasMore(data.hasMore ?? false);
    } catch {
      // silently fail, user can scroll again
    } finally {
      setLoadingMore(false);
    }
  }, [activeType, loadingMore, hasMore, paginatedSkills.length]);

  // IntersectionObserver for infinite scroll (only when not searching/filtering)
  useEffect(() => {
    if (results !== null) return; // search mode — no infinite scroll

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [results, loadMore]);

  const search = useCallback(
    async (q: string, tag: string) => {
      const hasQuery = q.trim().length > 0;
      const hasTag = tag !== "all";
      const hasType = activeType !== "all";

      if (!hasQuery && !hasTag && !hasType) {
        searchAbortRef.current?.abort();
        searchRequestIdRef.current += 1;
        setResults(null);
        setLoading(false);
        return;
      }

      searchAbortRef.current?.abort();
      const abortController = new AbortController();
      searchAbortRef.current = abortController;
      const requestId = ++searchRequestIdRef.current;

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (hasQuery) params.set("q", q.trim());
        if (hasTag) params.set("tag", tag);
        if (hasType) params.set("type", activeType);
        const res = await fetch(`/api/skills?${params.toString()}`, {
          signal: abortController.signal,
        });
        const data = await res.json();
        if (requestId !== searchRequestIdRef.current) return;
        setResults(data.data ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (requestId !== searchRequestIdRef.current) return;
        setResults([]);
      } finally {
        if (requestId !== searchRequestIdRef.current) return;
        setLoading(false);
      }
    },
    [activeType]
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
      searchAbortRef.current?.abort();
    };
  }, [query, activeTag, activeType, debouncedSearch]);

  const handleTagClick = (tag: string) => {
    void setFilters({
      tag: tag === activeTag ? null : tag,
    });
  };

  const displayedSkills = results ?? paginatedSkills;
  const isSearchMode = results !== null;

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
          onChange={(e) =>
            void setFilters({
              query: e.target.value.trim().length > 0 ? e.target.value : null,
            })
          }
        />
        {loading && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {showTypeToggle && (
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            { value: "all", label: "All CLIs" },
            { value: "wrapper", label: "Wrapper CLI" },
            { value: "official", label: "Official CLI" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() =>
                void setFilters({
                  type: option.value === "all" || activeType === option.value ? null : option.value,
                })
              }
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                activeType === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Tags */}
      {visibleTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => void setFilters({ tag: null })}
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
              {activeType !== "all"
                ? ` in ${activeType === "official" ? "Official CLI" : "Wrapper CLI"}`
                : ""}
            </p>
            {query && (
              <p className="mt-2 text-sm text-muted-foreground">
                This CLI doesn&apos;t exist yet. Ask your agent to create it.
              </p>
            )}
            <pre className="mx-auto mt-4 inline-block rounded-xl bg-muted px-5 py-3 font-mono text-xs text-muted-foreground">
              Ask your agent: &quot;Create a CLI for{" "}
              {query ? query.trim() : "my API"}&quot;
            </pre>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayedSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} onTagClick={handleTagClick} />
              ))}
            </div>

            {/* Infinite scroll sentinel */}
            {!isSearchMode && hasMore && (
              <div ref={sentinelRef} className="flex justify-center py-8">
                {loadingMore && (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
