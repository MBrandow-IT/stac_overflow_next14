import React from "react";

import { getQuestionsByAuthorId } from "@/lib/actions/question.action";
import QuestionCard from "@/components/cards/QuestionCard";

interface props {
  userId: string;
}

const UserQuestions = async ({ userId }: props) => {
  const questions = await getQuestionsByAuthorId(userId);

  return (
    <div className="gap-4 flex flex-col mt-4">
      {questions.questions.map((question) => (
        <QuestionCard
          key={question._id}
          _id={question._id}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upVotes={question.upvotes}
          answers={question.answers}
          views={question.views}
          createdAt={question.createdAt}
        />
      ))}
    </div>
  );
};

export default UserQuestions;
