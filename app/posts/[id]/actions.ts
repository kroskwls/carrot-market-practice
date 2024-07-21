"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { notFound } from "next/navigation";

export const likePost = async (postId: number) => {
  const session = await getSession();
  if (!session.id) {
    return notFound();
  }

  try {
    const userId = session.id;
    await db.like.create({
      data: { postId, userId },
    });
    revalidateTag(`like-status-${postId}`);
  } catch {}
};

export const dislikePost = async (postId: number) => {
  const session = await getSession();
  if (!session.id) {
    return notFound();
  }

  try {
    const userId = session.id;
    await db.like.delete({
      where: {
        id: { postId, userId },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch {}
};
