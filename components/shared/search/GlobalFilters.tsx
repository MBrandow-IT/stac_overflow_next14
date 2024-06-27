"use client";

import { Button } from "@/components/ui/button";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const GlobalFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("type");

  const [searchValue, setSearchValue] = React.useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "type",
          value: searchValue,
        });

        router.push(newUrl, { scroll: false });
      } else {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["type"],
        });
        router.push(newUrl, { scroll: false });
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, pathname, router, searchParams, query]);

  return (
    <div className="flex gap-3 items-center">
      <p className="text-dark400_light900 body-medium">Type:</p>
      <Button
        className={`${
          searchValue === "question"
            ? "bg-primary-500 text-light-900"
            : "light-border-2 bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:text-light-800 dark:hover:text-primary-500"
        } rounded-3xl px-5 py-2 small-medium capitalize`}
        onClick={() => {
          searchValue !== "question"
            ? setSearchValue("question")
            : setSearchValue("");
        }}
      >
        Question
      </Button>
      <Button
        className={`${
          searchValue === "answer"
            ? "bg-primary-500 text-light-900"
            : "light-border-2 bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:text-light-800 dark:hover:text-primary-500"
        } rounded-3xl px-5 py-2 small-medium capitalize`}
        onClick={() => {
          searchValue !== "answer"
            ? setSearchValue("answer")
            : setSearchValue("");
        }}
      >
        Answer
      </Button>
      <Button
        className={`${
          searchValue === "user"
            ? "bg-primary-500 text-light-900"
            : "light-border-2 bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:text-light-800 dark:hover:text-primary-500"
        } rounded-3xl px-5 py-2 small-medium capitalize`}
        onClick={() => {
          searchValue !== "user" ? setSearchValue("user") : setSearchValue("");
        }}
      >
        User
      </Button>
      <Button
        className={`${
          searchValue === "tag"
            ? "bg-primary-500 text-light-900"
            : "light-border-2 bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:text-light-800 dark:hover:text-primary-500"
        } rounded-3xl px-5 py-2 small-medium capitalize`}
        onClick={() => {
          searchValue !== "tag" ? setSearchValue("tag") : setSearchValue("");
        }}
      >
        Tag
      </Button>
    </div>
  );
};

export default GlobalFilters;
