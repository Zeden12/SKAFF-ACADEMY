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
import { CLASS_STATUS_LABELS } from "@/lib/constants/programs";
import type { ClassStatus, Program } from "@/lib/types";

const STATUS_OPTIONS: ClassStatus[] = ["upcoming", "active", "completed", "cancelled"];

interface ClassesFiltersProps {
  programs: Program[];
}

export function ClassesFilters({ programs }: ClassesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<number | undefined>(undefined);

  const statusValue = searchParams.get("status") ?? "all";
  const programValue = searchParams.get("program") ?? "all";
  const selectedProgramName = programs.find((p) => p.id === programValue)?.name;

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
        placeholder="Search classes..."
        containerClassName="sm:w-72"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <Select value={programValue} onValueChange={(value) => updateParam("program", value === "all" ? "" : value)}>
        <SelectTrigger className="sm:w-56">
          <SelectValue placeholder="All programs">
            {programValue === "all" ? "All programs" : (selectedProgramName ?? "All programs")}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All programs</SelectItem>
          {programs.map((program) => (
            <SelectItem key={program.id} value={program.id}>
              {program.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={statusValue} onValueChange={(value) => updateParam("status", value === "all" ? "" : value)}>
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="All statuses">
            {statusValue === "all" ? "All statuses" : CLASS_STATUS_LABELS[statusValue as ClassStatus]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status} value={status}>
              {CLASS_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterBar>
  );
}
