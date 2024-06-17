import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import SearchFilter from "@/components/shared/search/SearchFilter";
import { HomePageFilters } from "@/constants";
import { getAllTagQuestions } from "@/lib/actions/tags.action";
import { URLProps } from "@/types";
import React from "react";

const TagDetails = async ({ params, searchParams }: URLProps) => {
  const tagId = params.id;
  const page = searchParams?.page;

  const query = searchParams?.q;
  const filter = searchParams?.filter;

  const result = await getAllTagQuestions({
    tagId,
    searchQuery: query,
    filter,
    page: page ? Number(page) : 1,
    pageSize: 15,
  });

  return (
    <div>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">
          {result?.tag.name} Questions
        </h1>
      </div>
      <div className="mt-11 w-full sm:flex gap-2">
        <LocalSearchBar
          route={`/tags/${tagId}`}
          imgSrc="/assets/icons/search.svg"
          iconPosition="left"
          placeholder="Search for questions..."
          otherClasses="flex-1 mb-2"
        />
        <SearchFilter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="flex"
          path={`/tags/${tagId}`}
        />
      </div>
      <div className="mt-10 flex flex-col gap-6 w-full">
        {result?.tag.questions.length > 0 ? (
          result?.tag.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              views={question.views}
              answers={question.answers}
              upVotes={question.upvotes}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There are no questions with this tag"
            description="Hmm, that's add, a question got added without a tag. 🤔 You can help us by asking a question with this tag. 🚀"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        currentViewFull={result?.isNext || false}
      />
    </div>
  );
};

export default TagDetails;
