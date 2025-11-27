"use client";

import { FLOWER_TAGS, TEDDY_SIZES, TEDDY_COLORS } from "@/lib/constants";

interface FilterBarProps {
  type: "flowers" | "teddy";
  selectedTags?: string[];
  selectedSizes?: number[];
  selectedColors?: string[];
  onTagChange?: (tags: string[]) => void;
  onSizeChange?: (sizes: number[]) => void;
  onColorChange?: (colors: string[]) => void;
}

export default function FilterBar({
  type,
  selectedTags = [],
  selectedSizes = [],
  selectedColors = [],
  onTagChange,
  onSizeChange,
  onColorChange,
}: FilterBarProps) {
  if (type === "flowers") {
    const isAllSelected = selectedTags.length === 0;
    
    return (
      <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
        <button
          type="button"
          onClick={() => {
            if (onTagChange) {
              onTagChange([]);
            }
          }}
          className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
            isAllSelected
              ? "bg-brand-green text-white border-2 border-brand-green"
              : "bg-white text-brand-gray-900 border-2 border-brand-red hover:border-brand-green hover:bg-brand-green hover:text-white"
          }`}
          aria-pressed={isAllSelected}
          aria-label="Show all flowers"
        >
          All
        </button>
        {FLOWER_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => {
                if (onTagChange) {
                  if (isSelected) {
                    // Deselect if clicking the same tag
                    onTagChange([]);
                  } else {
                    // Select only this tag (single selection)
                    onTagChange([tag]);
                  }
                }
              }}
              className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                isSelected
                  ? "bg-brand-green text-white border-2 border-brand-green"
                  : "bg-white text-brand-gray-900 border-2 border-brand-red hover:border-brand-green hover:bg-brand-green hover:text-white"
              }`}
              aria-pressed={isSelected}
              aria-label={`Filter by ${tag}`}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          );
        })}
      </div>
    );
  }

  if (type === "teddy") {
    return (
      <div className="mb-6">
        <div>
          <h3 className="font-heading font-semibold mb-3">Size (cm)</h3>
          <div className="flex flex-wrap gap-2">
            {TEDDY_SIZES.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    if (onSizeChange) {
                      if (isSelected) {
                        // Deselect if clicking the same size
                        onSizeChange([]);
                      } else {
                        // Select only this size (single selection)
                        onSizeChange([size]);
                      }
                    }
                  }}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    isSelected
                      ? "bg-brand-green text-white border-2 border-brand-green"
                      : "bg-white text-brand-gray-900 border-2 border-brand-red hover:border-brand-green hover:bg-brand-green hover:text-white"
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`Filter by size ${size}cm`}
                >
                  {size}cm
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

