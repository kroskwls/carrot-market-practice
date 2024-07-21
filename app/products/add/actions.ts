"use server";

import { File } from "buffer";
import fs from "fs/promises";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { productSchema } from "./schema";

export async function uploadProduct(_: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
    photo: formData.get("photo"),
    price: formData.get("price"),
    description: formData.get("description"),
  };
  if (data.photo instanceof File) {
    const photoData = await data.photo.arrayBuffer();
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));

    data.photo = `/${data.photo.name}`;
  }

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }

  const session = await getSession();
  if (session.id) {
    const product = await db.product.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        price: result.data.price,
        photo: result.data.photo,
        user: {
          connect: {
            id: session.id
          }
        }
      },
      select: {
        id: true
      }
    });

    redirect(`/products/${product.id}`);
  }
}