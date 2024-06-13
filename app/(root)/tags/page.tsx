import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import SearchFilter from "@/components/shared/search/SearchFilter";

import { TagFilters } from "@/constants";
import NoResult from "@/components/shared/NoResult";
import Link from "next/link";
import { getAllTags } from "@/lib/actions/tags.action";
import TagCard from "@/components/cards/TagCard";

export default async function Tags() {
  const result = await getAllTags({});

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Tags</h1>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col">
        <LocalSearchBar
          route="/community"
          imgSrc="/assets/icons/search.svg"
          iconPosition="left"
          placeholder="Search by tag name..."
          otherClasses="flex-1"
        />
        <SearchFilter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses=""
        />
      </div>
      <div
        className={`mt-10 flex flex-wrap gap-6 w-full flex-row max-h-[300px]`}
      >
        {result.length > 0 ? (
          result.map((tag, index) => (
            <Link key={index} href={`/tags/${tag._id}`} className="w-[260px]">
              <TagCard
                name={tag.name}
                description={tag.description}
                count={tag.count}
              />
            </Link>
          ))
        ) : (
          <NoResult
            title="There's no users yet"
            description="Be the first to sign up! 🚀 Click sign up and start asking questions to launch our platform!💡"
            link="/sign-up"
            linkTitle="Sign Up!"
          />
        )}
      </div>
    </>
  );
}
