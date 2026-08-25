"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterBar } from "@/components/shared/filter-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ClassGroup } from "@/lib/types";

const RANGE_OPTIONS: { value: string; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "all", label: "All" },
];

interface ScheduleFiltersProps {
  classGroups: ClassGroup[];
}

export function ScheduleFilters({ classGroups }: ScheduleFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const classValue = searchParams.get("class") ?? "all";
  const rangeValue = searchParams.get("range") ?? "upcoming";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <FilterBar>
      <Select value={classValue} onValueChange={(value) => updateParam("class", value)}>
        <SelectTrigger className="sm:w-48">
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
      <Select value={rangeValue} onValueChange={(value) => updateParam("range", value)}>
        <SelectTrigger className="sm:w-36">
          <SelectValue>{RANGE_OPTIONS.find((r) => r.value === rangeValue)?.label}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {RANGE_OPTIONS.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterBar>
  );
}
