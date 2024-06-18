"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("global");

  const [searchValue, setSearchValue] = React.useState(query || "");
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: searchValue,
        });

        router.push(newUrl, { scroll: false });
      } else {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["global", "type"],
        });
        router.push(newUrl, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, pathname, router, searchParams, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={containerRef}
    >
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search globally"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);

            if (!isOpen) {
              setIsOpen(true);
            }
            if (e.target.value === "" && isOpen) {
              setIsOpen(false);
            }
          }}
          className="paragraph-regular text-dark400_light700 no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
        />
      </div>
      {isOpen && <GlobalResult setIsOpen={setIsOpen} />}
    </div>
  );
};

export default GlobalSearch;
