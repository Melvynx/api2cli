"use client";

import { useState } from "react";

export function CategoryFilter({
  categories,
}: {
  categories: { value: string; label: string; icon: string }[];
}) {
  const [active, setActive] = useState("all");

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setActive("all")}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
          active === "all"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setActive(cat.value)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
            active === cat.value
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          <span>{cat.icon}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}
