/**
 * FilterSidebar — Premium filter panel
 */

"use client";

import { X, Check } from "lucide-react";

interface FilterSidebarProps {
  productTypes: string[];
  tags: string[];
  selectedTypes: string[];
  selectedTags: string[];
  onTypeChange: (types: string[]) => void;
  onTagChange: (tags: string[]) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function FilterSidebar({
  productTypes,
  tags,
  selectedTypes,
  selectedTags,
  onTypeChange,
  onTagChange,
  mobileOpen,
  onMobileClose,
}: FilterSidebarProps) {
  const toggleType = (type: string) => {
    onTypeChange(
      selectedTypes.includes(type)
        ? selectedTypes.filter((t) => t !== type)
        : [...selectedTypes, type]
    );
  };

  const toggleTag = (tag: string) => {
    onTagChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag]
    );
  };

  const clearAll = () => {
    onTypeChange([]);
    onTagChange([]);
  };

  const hasActiveFilters = selectedTypes.length > 0 || selectedTags.length > 0;

  const sidebar = (
    <nav className="space-y-8">
      <div className="flex items-baseline justify-between pb-4 border-b border-black/[0.06]">
        <h3 className="font-heading text-lg text-ink">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-[10px] uppercase tracking-widest text-accent hover:text-accent-dark transition-colors"
          >
            Reset all
          </button>
        )}
      </div>

      {productTypes.length > 0 && (
        <div>
          <h4 className="label text-[10px] mb-4">Product Type</h4>
          <div className="space-y-0.5">
            {productTypes.map((type) => {
              const isActive = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 group ${
                    isActive ? "bg-accent-soft" : "hover:bg-surface-warm"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      isActive
                        ? "bg-accent border-accent"
                        : "border-ink/15 group-hover:border-ink/30"
                    }`}
                  >
                    {isActive && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  </span>
                  <span
                    className={`text-sm capitalize transition-colors duration-200 ${
                      isActive ? "text-ink font-medium" : "text-ink-light group-hover:text-ink"
                    }`}
                  >
                    {type.replace(/-/g, " ")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {productTypes.length > 0 && tags.length > 0 && (
        <div className="border-t border-black/[0.04]" />
      )}

      {tags.length > 0 && (
        <div>
          <h4 className="label text-[10px] mb-4">Wellness Goals</h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3.5 py-1.5 rounded-full text-xs tracking-wide transition-all duration-200 capitalize ${
                    isActive
                      ? "bg-brand-dark text-white"
                      : "bg-transparent text-ink-light border border-ink/10 hover:border-accent hover:text-accent"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );

  return (
    <>
      <aside className="hidden lg:block w-[260px] flex-shrink-0">
        <div className="sticky top-28 p-6 rounded-card bg-white border border-black/[0.04]">
          {sidebar}
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]" onClick={onMobileClose} />
          <div className="absolute left-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-white shadow-elevated overflow-y-auto">
            <div className="flex items-center justify-between px-6 pt-7 pb-5 border-b border-black/[0.06]">
              <h3 className="font-heading text-lg text-ink">Filters</h3>
              <button
                onClick={onMobileClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-warm transition-colors"
              >
                <X className="w-4 h-4 text-ink-light" />
              </button>
            </div>
            <div className="px-6 py-6">{sidebar}</div>
          </div>
        </div>
      )}
    </>
  );
}
