import ListProduct from "@/components/list-product";
import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

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
    </div>
  );
}