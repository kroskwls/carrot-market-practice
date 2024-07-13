"use client";

import {
  HomeIcon as SolidHomeIcon,
  NewspaperIcon as SolidNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as SolidChatBubble,
  VideoCameraIcon as SolidVideoCameraIcon,
  UserIcon as SolidUserIcon
} from "@heroicons/react/24/solid";
import {
  HomeIcon as OutlineHomeIcon,
  NewspaperIcon as OutlineNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChatBubble,
  VideoCameraIcon as OutlineVideoCameraIcon,
  UserIcon as OutlineUserIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();

  return (
    <div className="fixed w-full bottom-0 left-0">
      <div className="max-w-screen-sm mx-auto grid grid-cols-5 border-neutral-600 border-t px-5 py-3 *:text-white bg-neutral-800">
        <Link href="/products" className="flex flex-col items-center gap-px">
          {pathname === "/products" ? (
            <SolidHomeIcon className="size-7" />
          ) : (
            <OutlineHomeIcon className="size-7" />
          )}
          <span>Home</span>
        </Link>
        <Link href="/life" className="flex flex-col items-center gap-px">
          {pathname === "/life" ? (
            <SolidNewspaperIcon className="size-7" />
          ) : (
            <OutlineNewspaperIcon className="size-7" />
          )}
          <span>Neighborhood</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-px">
          {pathname === "/chat" ? (
            <SolidChatBubble className="size-7" />
          ) : (
            <OutlineChatBubble className="size-7" />
          )}
          <span>Chat</span>
        </Link>
        <Link href="/live" className="flex flex-col items-center gap-px">
          {pathname === "/live" ? (
            <SolidVideoCameraIcon className="size-7" />
          ) : (
            <OutlineVideoCameraIcon className="size-7" />
          )}
          <span>Shopping</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-px">
          {pathname === "/profile" ? (
            <SolidUserIcon className="size-7" />
          ) : (
            <OutlineUserIcon className="size-7" />
          )}
          <span>My Carrot</span>
        </Link>
      </div>
    </div>
  )
}