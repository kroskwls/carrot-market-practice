"use server";

import db from "@/lib/db";

const countPerPage = 1;

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      photo: true,
      id: true,
      created_at: true
    },
    skip: page * countPerPage,
    take: countPerPage,
    orderBy: {
      created_at: "desc"
    }
  });

  return products;
}