"use client";

import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterBar } from "@/components/shared/filter-bar";
import { SearchInput } from "@/components/shared/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LearningMaterialType, Module } from "@/lib/types";

const TYPE_LABELS: Record<LearningMaterialType, string> = {
  document: "Document",
  video: "Video",
  link: "Link",
  slide_deck: "Slides",
};

interface MaterialsFiltersProps {
  modules: Module[];
}

export function MaterialsFilters({ modules }: MaterialsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<number | undefined>(undefined);

  const moduleValue = searchParams.get("module") ?? "all";
  const typeValue = searchParams.get("type") ?? "all";
  const selectedModuleName = modules.find((m) => m.id === moduleValue)?.title;

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleSearchChange(value: string) {
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => updateParam("q", value), 300);
  }

  return (
    <FilterBar>
      <SearchInput
        placeholder="Search materials..."
        containerClassName="sm:w-72"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <Select value={moduleValue} onValueChange={(value) => updateParam("module", value === "all" ? "" : value)}>
        <SelectTrigger className="sm:w-56">
          <SelectValue placeholder="All modules">
            {moduleValue === "all" ? "All modules" : (selectedModuleName ?? "All modules")}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All modules</SelectItem>
          {modules.map((module) => (
            <SelectItem key={module.id} value={module.id}>
              {module.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={typeValue} onValueChange={(value) => updateParam("type", value === "all" ? "" : value)}>
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="All types">
            {typeValue === "all" ? "All types" : TYPE_LABELS[typeValue as LearningMaterialType]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterBar>
  );
}
