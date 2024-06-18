"use client";

import React, { useEffect } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalFilters from "./GlobalFilters";
import { getGlobalSearchResult } from "@/lib/actions/global.action";

interface GlobalResultProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SearchResultItem {
  type: string;
  _id: string;
  clerkId?: string;
  title?: string;
  username?: string;
  name?: string;
}

const GlobalResult: React.FC<GlobalResultProps> = ({ setIsOpen }) => {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<SearchResultItem[]>([]);

  const global = searchParams.get("global");
  const type = searchParams.get("type") || "";

  useEffect(() => {
    setResult([]);
    setIsLoading(true);
    const fetchResult = async () => {
      try {
        if (!global) return;

        const globalSearchResult = await getGlobalSearchResult({
          global,
          type,
        });

        setResult(JSON.parse(globalSearchResult));
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, [global, type]);

  const renderLink = (
    itemType: string,
    id: string,
    clerkId?: string
  ): string => {
    if (itemType === "question") return `/question/${id}`;

    if (itemType === "tag") return `/tags/${id}`;
    if (itemType === "user") return `/profile/${clerkId}`;
    if (itemType === "answer") return `/question/${id}`;

    return "/";
  };

  return (
    <div className="flex flex-col top-full z-10 absolute mt-3 w-full bg-light-800 shadow-sm dark:bg-dark-400 rounded-xl py-5">
      <p className="text-dark400_light900 paragraph-semibold px-5">
        <GlobalFilters />
      </p>
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />
      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>

        {isLoading ? (
          <div className="flex-center flex-col px-5">
            <ReloadIcon className="my-2 h-10 w-10 text-primary-500 animate-spin" />
            <p className="text-dark200_light800 body-regular">
              Browsing the entire database
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {result.length > 0 ? (
              result.map((item: SearchResultItem, index: number) => (
                <Link
                  href={renderLink(item.type, item._id, item.clerkId)}
                  onClick={() => setIsOpen(false)}
                  key={item.type + item._id + index}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50"
                >
                  <Image
                    src="/assets/icons/tag.svg"
                    alt="tags"
                    width={18}
                    height={18}
                    className="invert-colors object-contain"
                  />

                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light800 line-clamp-1 capitalize">
                      {item.title ? item.title : item.username || item.name}
                    </p>
                    <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-center flex-col px-5">
                <p className="text-dark200_light800 body-regular px-5 py-2.5">
                  Oops, no results found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;
