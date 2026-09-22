import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  manufacturer: z.string(),
  photos: z.string(), // JSON-encoded array of image URLs
  quantity: z.string(),
  available: z.string(),
  sales: z.string(),
  offer: z.string(),
  amount: z.string(),
  offer_price: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ProductsResponseSchema = z.object({
  products: z.array(ProductSchema),
  total_products: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>;