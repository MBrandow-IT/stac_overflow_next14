"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { handleSave, handleVote } from "@/lib/actions/voting.action";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  questionId?: string;
  userId?: string;
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
  upvotes: initialUpvotes,
  downvotes: initialDownvotes,
  liked: initialLiked,
  saved: initialSaved,
  disliked: initialDisliked,
}: Props) => {
  const [liked, setLiked] = useState(initialLiked);
  const [disliked, setDisliked] = useState(initialDisliked);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [saved, setSaved] = useState(initialSaved);
  const { toast } = useToast();

  const handleVotingClick = async (isUpVoting: boolean) => {
    try {
      if (!userId) {
        return;
      }
      await handleVote({
        userId: JSON.parse(userId),
        questionId: questionId ? JSON.parse(questionId) : null,
        answerId: answerId ? JSON.parse(answerId) : null,
        hasUpVoted: liked,
        hasDownVoted: disliked,
        isUpVoting,
        isDownVoting: !isUpVoting,
      });

      if (isUpVoting) {
        setLiked(!liked);
        if (liked) {
          setUpvotes(upvotes - 1);
        } else {
          setUpvotes(upvotes + 1);
          if (disliked) {
            setDisliked(false);
            setDownvotes(downvotes - 1);
          }
        }
      } else {
        setDisliked(!disliked);
        if (disliked) {
          setDownvotes(downvotes - 1);
        } else {
          setDownvotes(downvotes + 1);
          if (liked) {
            setLiked(false);
            setUpvotes(upvotes - 1);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveClick = async () => {
    try {
      if (!userId) {
        return;
      }
      await handleSave({
        userId: JSON.parse(userId),
        questionId: questionId ? JSON.parse(questionId) : null,
        isSaved: saved || false,
      });
      setSaved(!saved);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex items-center">
        <Button
          className="gap-1 mx-1 px-1"
          onClick={() => {
            userId
              ? handleVotingClick(true)
              : toast({
                  title: "Please login to vote",
                  description: "You must be logged in to vote on questions",
                });
          }}
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
          onClick={() => {
            userId
              ? handleVotingClick(true)
              : toast({
                  title: "Please login to vote",
                  description: "You must be logged in to vote on questions",
                });
          }}
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
          <Button
            className="gap-1 px-1 mx-1"
            onClick={() => {
              userId
                ? handleSaveClick()
                : toast({
                    title: "Please Login",
                    description: "You must be logged in to save questions",
                  });
            }}
          >
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
