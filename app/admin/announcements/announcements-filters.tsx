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
import { ANNOUNCEMENT_STATUS_LABELS, ANNOUNCEMENT_AUDIENCE_LABELS } from "@/lib/constants/communication";
import type { AnnouncementAudience, AnnouncementPublicationStatus } from "@/lib/types";

const STATUS_OPTIONS: AnnouncementPublicationStatus[] = ["draft", "published", "archived"];
const AUDIENCE_OPTIONS: AnnouncementAudience[] = ["all", "students", "staff", "applicants"];

export function AnnouncementsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<number | undefined>(undefined);

  const statusValue = searchParams.get("status") ?? "all";
  const audienceValue = searchParams.get("audience") ?? "all";

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
        placeholder="Search announcements..."
        containerClassName="sm:w-64"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <Select value={statusValue} onValueChange={(value) => updateParam("status", value === "all" ? "" : value)}>
        <SelectTrigger className="sm:w-36">
          <SelectValue placeholder="All statuses">
            {statusValue === "all" ? "All statuses" : ANNOUNCEMENT_STATUS_LABELS[statusValue as AnnouncementPublicationStatus]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status} value={status}>
              {ANNOUNCEMENT_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={audienceValue} onValueChange={(value) => updateParam("audience", value === "all" ? "" : value)}>
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder="All audiences">
            {audienceValue === "all" ? "All audiences" : ANNOUNCEMENT_AUDIENCE_LABELS[audienceValue as AnnouncementAudience]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All audiences</SelectItem>
          {AUDIENCE_OPTIONS.map((audience) => (
            <SelectItem key={audience} value={audience}>
              {ANNOUNCEMENT_AUDIENCE_LABELS[audience]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterBar>
  );
}
