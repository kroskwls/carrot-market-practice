import { z } from "zod";

export const productSchema = z.object({
  title: z.string({
    required_error: "Title is required"
  }),
  photo: z.string({
    required_error: "Photo is required"
  }),
  price: z.coerce.number({
    required_error: "Price is required"
  }),
  description: z.string({
    required_error: "Description is required"
  }),
});

export type ProductType = z.infer<typeof productSchema>;