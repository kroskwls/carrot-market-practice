import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import { ChatBubbleBottomCenterIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

async function getPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });

  return posts;
}

export const metadata = {
  title: "neighborhood",
};

export default async function Life() {
  const posts = await getPosts();

  return (
    <div className="p-5 flex flex-col divide-y *:py-5">
      {posts.map(({ id, title, description, created_at, views, _count }) => (
        <Link key={id} className="text-neutral-400 flex flex-col gap-2" href={`/posts/${id}`}>
          <h2 className="text-white text-lg font-semibold">{title}</h2>
          <p>{description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4 items-center">
              <span>{formatToTimeAgo(created_at.toString())}</span>
              <span>・</span>
              <span>조회 {views}</span>
            </div>
            <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
              <span>
                <HandThumbUpIcon className="size-4" />
                {_count.likes}
              </span>
              <span>
                <ChatBubbleBottomCenterIcon className="size-4" />
                {_count.comments}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
