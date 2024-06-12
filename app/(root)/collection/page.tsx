import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import SearchFilter from "@/components/shared/search/SearchFilter";
import { HomePageFilters } from "@/constants";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSavedQuestions } from "@/lib/actions/user.action";

export default async function Collections() {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const savedQuestions = await getSavedQuestions({ clerkId: userId });

  return (
    <div>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col md:flex-col">
        <LocalSearchBar
          route="/collection"
          imgSrc="/assets/icons/search.svg"
          iconPosition="left"
          placeholder="Search for saved questions..."
          otherClasses="flex-1"
        />
        <SearchFilter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <div className="mt-10 flex flex-col gap-6 w-full">
        {savedQuestions.questions.length > 0 ? (
          savedQuestions.questions.map((question: any) => (
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
            title="You have no favorites!"
            description="Change this by browsing our awesome community! 🚀 Find any of the questions that you like and give them a star! We'll keep them right here for you! 💡"
            link="/"
            linkTitle="Find Questions"
          />
        )}
      </div>
    </div>
  );
}
