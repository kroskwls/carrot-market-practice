import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";

const getInitialProducts = async () => {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      photo: true,
      id: true,
      created_at: true
    },
    take: 1,
    orderBy: {
      created_at: "desc"
    }
  });

  return products;
};

export type InitialProducts = Prisma.PromiseReturnType<typeof getInitialProducts>;

export default async function Products() {
  const initialProducts = await getInitialProducts();
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <div className="fixed bottom-24 left-0 w-full">
        <div className="max-w-screen-sm w-full mx-auto flex justify-end pr-5">
          <Link
            className="size-16 text-white bg-orange-500 flex items-center justify-center rounded-full transition-colors hover:bg-orange-400"
            href="/products/add">
            <PlusIcon className="siez-10" />
          </Link>
        </div>
      </div>
    </div>
  );
}