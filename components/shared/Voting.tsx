"use client";

import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { handleVote } from "@/lib/actions/voting.action";

interface Props {
  questionId?: string;
  userId: string;
  answerId?: string;
  upvotes: number;
  downvotes: number;
  liked: boolean;
  saved?: boolean;
  disliked: boolean;
}

const Voting = ({
  questionId,
  userId,
  answerId,
  upvotes,
  downvotes,
  liked,
  saved,
  disliked,
}: Props) => {
  const handleVotingClick = async (isUpVoting: boolean) => {
    try {
      await handleVote({
        userId: JSON.parse(userId),
        questionId: questionId ? JSON.parse(questionId) : null,
        answerId: answerId ? JSON.parse(answerId) : null,
        hasUpVoted: liked,
        hasDownVoted: disliked,
        isUpVoting,
        isDownVoting: !isUpVoting,
      });
      // console.log(
      //   questionId,
      //   userId,
      //   answerId,
      //   upvotes,
      //   downvotes,
      //   liked,
      //   saved,
      //   disliked
      // );
      // Optionally, update the UI state here to reflect the changes
    } catch (error) {
      console.log(error);
    }
  };

  console.log(liked, disliked);

  const handleFavoriteClick = () => {
    // Implement favorite click handling logic here if necessary
  };

  return (
    <div className="flex gap-2">
      <div className="flex items-center">
        <Button
          className="gap-1 mx-1 px-1"
          onClick={() => handleVotingClick(true)}
        >
          <Image
            alt="Upvote"
            src={
              liked ? "/assets/icons/upvoted.svg" : `/assets/icons/upvote.svg`
            }
            width={20}
            height={20}
          />
          <p className="subtle-medium text-dark400_light900">{upvotes}</p>
        </Button>
        <Button
          className="gap-1 px-1 mx-1"
          onClick={() => handleVotingClick(false)}
        >
          <Image
            alt="Downvote"
            src={
              disliked
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={20}
            height={20}
          />
          <p className="subtle-medium text-dark400_light900">{downvotes}</p>
        </Button>
        {answerId === undefined && (
          <Button className="gap-1 px-1 mx-1" onClick={handleFavoriteClick}>
            <Image
              alt="Favorite"
              src={
                saved
                  ? "/assets/icons/star-filled.svg"
                  : "/assets/icons/star-red.svg"
              }
              width={20}
              height={20}
            />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Voting;
