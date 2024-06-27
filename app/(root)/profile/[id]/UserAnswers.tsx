import React from "react";

import QuestionCard from "@/components/cards/QuestionCard";
import { getAnswersByAuthorId } from "@/lib/actions/asnwer.action";

interface props {
  userId: string;
}

const userAnswers = async ({ userId }: props) => {
  const answers = await getAnswersByAuthorId(userId);

  // console.log(answers);
  return (
    <div className="gap-4 flex flex-col mt-4">
      {answers.answers.map((answer) => (
        <QuestionCard
          key={answer._id}
          _id={answer._id}
          title={answer.question.title}
          author={answer.author}
          upVotes={answer.upvotes}
          createdAt={answer.createdAt}
          answer
        />
      ))}
    </div>
  );
};

export default userAnswers;
