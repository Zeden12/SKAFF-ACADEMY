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
import { APPLICATION_STATUS_LABELS } from "@/lib/constants/admissions";
import type { ApplicationStatus, Program } from "@/lib/types";

const STATUS_OPTIONS: ApplicationStatus[] = [
  "submitted",
  "under_review",
  "more_information_required",
  "approved",
  "rejected",
  "enrolled",
  "draft",
];

interface AdmissionsFiltersProps {
  programs: Program[];
}

const SORT_LABELS: Record<string, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  name: "Name A–Z",
};

export function AdmissionsFilters({ programs }: AdmissionsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<number | undefined>(undefined);

  const statusValue = searchParams.get("status") ?? "all";
  const programValue = searchParams.get("program") ?? "all";
  const sortValue = searchParams.get("sort") ?? "newest";
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
        placeholder="Search by name, email, or reference..."
        containerClassName="sm:w-72"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <Select value={statusValue} onValueChange={(value) => updateParam("status", value === "all" ? "" : value)}>
        <SelectTrigger className="sm:w-56">
          <SelectValue placeholder="All statuses">
            {statusValue === "all" ? "All statuses" : APPLICATION_STATUS_LABELS[statusValue as ApplicationStatus]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status} value={status}>
              {APPLICATION_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
      <Select value={sortValue} onValueChange={(value) => updateParam("sort", value === "newest" ? "" : value)}>
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Sort">{SORT_LABELS[sortValue]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="oldest">Oldest first</SelectItem>
          <SelectItem value="name">Name A–Z</SelectItem>
        </SelectContent>
      </Select>
    </FilterBar>
  );
}
