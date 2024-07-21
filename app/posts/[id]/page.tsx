import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import {
  EyeIcon,
  HandThumbUpIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandTHumbUpIcon } from "@heroicons/react/24/outline";
import {
  revalidatePath,
  unstable_cache as nextCache,
  revalidateTag,
} from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { dislikePost, likePost } from "./actions";
import LikeButton from "@/components/like-button";

interface PostDetailProps {
  params: { id: string };
}

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        owner: {
          select: {
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  } catch {
    return null;
  }
}
const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

async function getLikeStatus(postId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: { postId, userId },
    },
    select: { created_at: true },
  });

  const likeCount = await db.like.count({
    where: { postId },
  });

  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}
async function getCachedLikeStatus(postId: number) {
  const session = await getSession();
  if (!session.id) {
    return notFound();
  }

  const userId = session.id;
  const getCached = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });

  return getCached(postId, userId);
}

export default async function PostDetail({ params }: PostDetailProps) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const post = await getCachedPost(id);
  if (!post) {
    return notFound();
  }

  const { likeCount, isLiked } = await getCachedLikeStatus(id);

  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        {post.owner.avatar ? (
          <Image
            width={28}
            height={28}
            className="size-7 rounded-full"
            src={post.owner.avatar}
            alt={post.owner.name}
          />
        ) : (
          <UserCircleIcon className="size-7" />
        )}
        <div>
          <div className="text-sm font-semibold">{post.owner.name}</div>
          <div className="text-xs">
            {formatToTimeAgo(post.created_at.toString())}
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
      </div>
    </div>
  );
}
