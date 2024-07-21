"use client";

import { dislikePost, likePost } from "@/app/posts/[id]/actions";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandTHumbUpIcon } from "@heroicons/react/24/solid";
import { useOptimistic } from "react";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState, payload) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    })
  );

  const onClick = async () => {
    reducerFn(null);
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };

  return (
    <button
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 ${
        state.isLiked
          ? "bg-orange-500 text-white border-orange-500"
          : "hover:bg-neutral-700"
      }`}
      onClick={onClick}
    >
      {state.isLiked ? (
        <>
          <HandThumbUpIcon className="size-5" />
          <span>{state.likeCount}</span>
        </>
      ) : (
        <>
          <OutlineHandTHumbUpIcon className="size-5" />
          <span>Like ({state.likeCount})</span>
        </>
      )}
    </button>
  );
}
