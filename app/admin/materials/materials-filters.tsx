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
import { MATERIAL_STATUS_LABELS, MATERIAL_TYPE_LABELS } from "@/lib/constants/academic-content";
import type { ClassGroup, LearningMaterialStatus, LearningMaterialType, Module, Program } from "@/lib/types";

const STATUS_OPTIONS: LearningMaterialStatus[] = ["draft", "published", "archived"];
const TYPE_OPTIONS = Object.keys(MATERIAL_TYPE_LABELS) as LearningMaterialType[];

interface MaterialsFiltersProps {
  programs: Program[];
  classGroups: ClassGroup[];
  modules: Module[];
}

export function MaterialsFilters({ programs, classGroups, modules }: MaterialsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<number | undefined>(undefined);

  const programValue = searchParams.get("program") ?? "all";
  const classValue = searchParams.get("class") ?? "all";
  const moduleValue = searchParams.get("module") ?? "all";
  const typeValue = searchParams.get("type") ?? "all";
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
        placeholder="Search materials..."
        containerClassName="sm:w-64"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <Select value={programValue} onValueChange={(value) => updateParam("program", value === "all" ? "" : value)}>
        <SelectTrigger className="sm:w-48">
          <SelectValue placeholder="All programs">
            {programValue === "all" ? "All programs" : programs.find((p) => p.id === programValue)?.name}
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
      <Select value={typeValue} onValueChange={(value) => updateParam("type", value === "all" ? "" : value)}>
        <SelectTrigger className="sm:w-36">
          <SelectValue placeholder="All types">
            {typeValue === "all" ? "All types" : MATERIAL_TYPE_LABELS[typeValue as LearningMaterialType]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {TYPE_OPTIONS.map((type) => (
            <SelectItem key={type} value={type}>
              {MATERIAL_TYPE_LABELS[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={statusValue} onValueChange={(value) => updateParam("status", value === "all" ? "" : value)}>
        <SelectTrigger className="sm:w-36">
          <SelectValue placeholder="All statuses">
            {statusValue === "all" ? "All statuses" : MATERIAL_STATUS_LABELS[statusValue as LearningMaterialStatus]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status} value={status}>
              {MATERIAL_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterBar>
  );
}
