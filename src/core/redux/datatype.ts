import { z } from 'zod';

const DimensionsSchema = z.object({
  width: z.number(),
  height: z.number(),
  depth: z.number(),
});

const ReviewSchema = z.object({
  rating: z.number(),
  comment: z.string(),
  date: z.string(),
  reviewerName: z.string(),
  reviewerEmail: z.string().email(),
});

const MetaSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  barcode: z.string(),
  qrCode: z.string().url(),
});

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  tags: z.array(z.string()).optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  weight: z.number().optional(),
  dimensions: DimensionsSchema,
  warrantyInformation: z.string().optional(),
  shippingInformation: z.string().optional(),
  availabilityStatus: z.string().optional(),
  reviews: z.array(ReviewSchema),
  returnPolicy: z.string().optional(),
  minimumOrderQuantity: z.number().optional(),
  meta: MetaSchema.optional(),
  images: z.array(z.string().url()).optional(),
  thumbnail: z.string().url().optional(),
});

export const ProductsResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>;