import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import SearchFilter from "@/components/shared/search/SearchFilter";

import { CommunityFilters } from "@/constants";
import NoResult from "@/components/shared/NoResult";
import UserCard from "@/components/cards/UserCard";
import { getAllUsers } from "@/lib/actions/user.action";
import Link from "next/link";
import { URLProps } from "@/types";
import Pagination from "@/components/shared/Pagination";

export default async function Communities({ searchParams }: URLProps) {
  const query = searchParams?.q;
  const filter = searchParams?.filter;
  const page = searchParams?.page;

  const result = await getAllUsers({
    searchQuery: query,
    filter,
    page: page ? Number(page) : 1,
    pageSize: 15,
  });

  // const isLoading = true;

  // if (isLoading) return <Loading />;

  return (
    <div className="w-full">
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col">
        <LocalSearchBar
          route="/community"
          imgSrc="/assets/icons/search.svg"
          iconPosition="left"
          placeholder="Search amazing minds..."
          otherClasses="flex-1"
        />
        <SearchFilter
          filters={CommunityFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses=""
          path="/community"
        />
      </div>
      <div className={`mt-10 flex flex-wrap gap-6 w-full flex-row `}>
        {result.users.length > 0 ? (
          result.users.map((user, index) => (
            <Link
              key={index}
              href={`/profile/${user.clerkId}`}
              className="w-[260px]"
            >
              <UserCard
                picture={user.picture}
                name={user.name}
                username={user.username}
                tags={user.tags}
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
      <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        currentViewFull={result.isNext}
      />
    </div>
  );
}
