import { api } from './api';
import type {
  Category,
  Ingredient,
  Paginated,
  ProductDetail,
  ProductSummary,
  Review,
  Symptom,
  WishlistItem,
} from '../types';

export interface ProductQuery {
  search?: string;
  category?: string;
  symptom?: string;
  ingredient?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  ordering?: string;
  page?: number;
}

export async function fetchProducts(query: ProductQuery = {}) {
  const { data } = await api.get<Paginated<ProductSummary>>('/products/', { params: query });
  return data;
}

export async function fetchProduct(slug: string) {
  const { data } = await api.get<ProductDetail>(`/products/${slug}/`);
  return data;
}

export async function fetchFeaturedProducts() {
  const { data } = await api.get<Paginated<ProductSummary> | ProductSummary[]>('/products/featured/');
  return Array.isArray(data) ? data : data.results;
}

export async function fetchBestsellers() {
  const { data } = await api.get<Paginated<ProductSummary> | ProductSummary[]>('/products/bestsellers/');
  return Array.isArray(data) ? data : data.results;
}

export async function fetchCategories() {
  const { data } = await api.get<Category[]>('/categories/');
  return data;
}

export async function fetchSymptoms() {
  const { data } = await api.get<Symptom[]>('/symptoms/');
  return data;
}

export async function fetchIngredients() {
  const { data } = await api.get<Ingredient[]>('/ingredients/');
  return data;
}

export async function fetchProductReviews(productSlug: string) {
  const { data } = await api.get<Paginated<Review> | Review[]>(`/products/${productSlug}/reviews/`);
  return Array.isArray(data) ? data : data.results;
}

export async function createProductReview(
  productSlug: string,
  payload: { rating: number; title?: string; comment?: string },
) {
  const { data } = await api.post<Review>(`/products/${productSlug}/reviews/`, payload);
  return data;
}

export async function fetchWishlist() {
  const { data } = await api.get<Paginated<WishlistItem> | WishlistItem[]>('/wishlist/');
  return Array.isArray(data) ? data : data.results;
}

export async function addToWishlist(productId: string) {
  const { data } = await api.post<WishlistItem>('/wishlist/', { product_id: productId });
  return data;
}

export async function removeFromWishlist(wishlistItemId: string) {
  await api.delete(`/wishlist/${wishlistItemId}/`);
}
