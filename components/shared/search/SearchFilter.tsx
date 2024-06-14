"use client";

import React, { useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HomeFilters from "../home/HomeFilters";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

interface SearchFilterProps {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
  path: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  filters,
  otherClasses,
  containerClasses,
  path,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("filter");

  const [activeFilter, setActiveFilter] = React.useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (activeFilter) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "filter",
          value: activeFilter,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === path) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["filter"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [activeFilter, pathname, router, searchParams, query, path]);

  return (
    <>
      <div className={`relative ${containerClasses}`}>
        <Select onValueChange={setActiveFilter}>
          <SelectTrigger
            className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
          >
            <div className="line-clamp-1 flex-1 text-left">
              <SelectValue
                placeholder={`${
                  activeFilter
                    ? activeFilter
                        .split("_") // Split the string by underscores
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        ) // Capitalize the first letter of each word
                        .join(" ") // Join the words back together with a space
                    : "Select a filter..."
                }`}
              />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="text-dark500_light700 background-light800_dark300">
              {filters.map((filter, index) => (
                <SelectItem
                  key={index}
                  value={filter.value}
                  // onChange={setActiveFilter(filter.value)}
                >
                  {filter.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <HomeFilters
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
    </>
  );
};

export default SearchFilter;
