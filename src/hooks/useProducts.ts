import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  createProductReview,
  fetchBestsellers,
  fetchCategories,
  fetchFeaturedProducts,
  fetchIngredients,
  fetchProduct,
  fetchProductReviews,
  fetchProducts,
  fetchSymptoms,
  type ProductQuery,
} from '../lib/products';
import { apiErrorMessage } from '../lib/api';

export function useProducts(query: ProductQuery) {
  return useQuery({
    queryKey: ['products', query],
    queryFn: () => fetchProducts(query),
    placeholderData: (prev) => prev,
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug as string),
    enabled: Boolean(slug),
  });
}

export function useFeaturedProducts() {
  return useQuery({ queryKey: ['products', 'featured'], queryFn: fetchFeaturedProducts });
}

export function useBestsellers() {
  return useQuery({ queryKey: ['products', 'bestsellers'], queryFn: fetchBestsellers });
}

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: fetchCategories, staleTime: 5 * 60_000 });
}

export function useSymptoms() {
  return useQuery({ queryKey: ['symptoms'], queryFn: fetchSymptoms, staleTime: 5 * 60_000 });
}

export function useIngredients() {
  return useQuery({ queryKey: ['ingredients'], queryFn: fetchIngredients, staleTime: 5 * 60_000 });
}

export function useProductReviews(productSlug: string | undefined) {
  return useQuery({
    queryKey: ['reviews', productSlug],
    queryFn: () => fetchProductReviews(productSlug as string),
    enabled: Boolean(productSlug),
  });
}

export function useCreateReview(productSlug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { rating: number; title?: string; comment?: string }) =>
      createProductReview(productSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productSlug] });
      queryClient.invalidateQueries({ queryKey: ['product', productSlug] });
      toast.success('Thanks for your review!');
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not submit your review.')),
  });
}
