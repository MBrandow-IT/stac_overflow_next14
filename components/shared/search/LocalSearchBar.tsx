"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

interface LocalSearchBarProps {
  route: string;
  imgSrc: string;
  iconPosition: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchBar = ({
  route,
  imgSrc,
  iconPosition,
  placeholder,
  otherClasses,
}: LocalSearchBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [searchValue, setSearchValue] = React.useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: searchValue,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["q"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, route, pathname, router, searchParams, query]);

  return (
    <div
      className={`flex-1 background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-4 rounded-xl px-4 w-full ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="Search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        className="paragraph-regular no-focus placeholder:text-slate-500 background-light800_darkgradient border-none shadow-none outline-none"
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="Search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchBar;
