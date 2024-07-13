import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface RouteParameters {
  params: { id: string }
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          avatar: true
        }
      }
    }
  });

  return product;
}

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
}

export default async function ProductDetail({ params }: RouteParameters) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  return (
    <div>
      <div className="relative aspect-square">
        <Image fill src={product.photo} alt={product.title} />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10">
          {product.user.avatar !== null ? (
            <div className="size-10 relative">
              <Image className="rounded-full object-cover" fill src={product.user.avatar} alt={product.user.name} />
            </div>
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.name}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed bottom-0 left-0 w-full">
        <div className="max-w-screen-sm mx-auto p-5 pb-10 bg-neutral-800 flex justify-between items-center">
          <span className="font-semibold text-lg">{formatToWon(product.price)}원</span>
          {isOwner ? (
            <button className="bg-red-500 px-5 py-2.5 text-white rounded-md font-semibold">Delete product</button>
          ) : (
            <Link className="bg-orange-500 px-5 py-2.5 text-white rounded-md font-semibold" href={``}>Go Chat</Link>
          )}
        </div>
      </div>
    </div>
  )
}