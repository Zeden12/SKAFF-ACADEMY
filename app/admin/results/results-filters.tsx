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
import { RESULT_STATUS_LABELS } from "@/lib/constants/student-portal";
import type { ClassGroup, Module, ResultPublicationStatus } from "@/lib/types";

const STATUS_OPTIONS: ResultPublicationStatus[] = ["draft", "published"];

interface ResultsFiltersProps {
  classGroups: ClassGroup[];
  modules: Module[];
}

export function ResultsFilters({ classGroups, modules }: ResultsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<number | undefined>(undefined);

  const classValue = searchParams.get("class") ?? "all";
  const moduleValue = searchParams.get("module") ?? "all";
  const statusValue = searchParams.get("status") ?? "all";

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
        placeholder="Search assessments..."
        containerClassName="sm:w-64"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <Select value={classValue} onValueChange={(value) => updateParam("class", value === "all" ? "" : value)}>
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder="All classes">
            {classValue === "all" ? "All classes" : classGroups.find((c) => c.id === classValue)?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All classes</SelectItem>
          {classGroups.map((classGroup) => (
            <SelectItem key={classGroup.id} value={classGroup.id}>
              {classGroup.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={moduleValue} onValueChange={(value) => updateParam("module", value === "all" ? "" : value)}>
        <SelectTrigger className="sm:w-52">
          <SelectValue placeholder="All modules">
            {moduleValue === "all" ? "All modules" : modules.find((m) => m.id === moduleValue)?.title}
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
      <Select value={statusValue} onValueChange={(value) => updateParam("status", value === "all" ? "" : value)}>
        <SelectTrigger className="sm:w-36">
          <SelectValue placeholder="All statuses">
            {statusValue === "all" ? "All statuses" : RESULT_STATUS_LABELS[statusValue as ResultPublicationStatus]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status} value={status}>
              {RESULT_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterBar>
  );
}
