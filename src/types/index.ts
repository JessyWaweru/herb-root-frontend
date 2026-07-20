export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image_url: string;
  product_count: number;
  display_order: number;
}

export interface Symptom {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  product_count: number;
}

export interface Ingredient {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface PlantOrigin {
  id: string;
  name: string;
  region: string;
  country: string;
  description: string;
  latitude: string | null;
  longitude: string | null;
}

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
}

export interface PlantGalleryImage {
  id: string;
  image_url: string;
  caption: string;
  display_order: number;
}

export interface Review {
  id: string;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  price: string;
  compare_at_price: string | null;
  currency: string;
  primary_image_url: string;
  category: Category | null;
  symptoms: Symptom[];
  is_in_stock: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  average_rating: string;
  review_count: number;
}

export interface ProductDetail extends ProductSummary {
  sku: string;
  description: string;
  how_it_helps: string;
  usage_instructions: string;
  stock_quantity: number;
  ingredients: Ingredient[];
  plant_origin: PlantOrigin | null;
  gallery_images: ProductImage[];
  plant_gallery_images: PlantGalleryImage[];
  reviews: Review[];
  related_products: ProductSummary[];
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  is_email_verified: boolean;
  newsletter_opt_in: boolean;
  date_joined: string;
}

export interface Address {
  id: string;
  label: string;
  full_name: string;
  phone_number: string;
  address_line1: string;
  address_line2: string;
  city: string;
  county_or_state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  product: ProductSummary;
  quantity: number;
  line_total: string;
  created_at: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: string;
  total_items: number;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product_slug: string | null;
  product_image: string | null;
  product_name: string;
  unit_price: string;
  quantity: number;
  line_total: string;
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  items: OrderItem[];
  full_name: string;
  phone_number: string;
  shipping_address_text: string;
  subtotal: string;
  shipping_fee: string;
  total_amount: string;
  currency: string;
  customer_notes: string;
  paid_at: string | null;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  product: ProductSummary;
  created_at: string;
}

export interface PaymentInit {
  authorization_url: string;
  reference: string;
  public_key: string;
}

export interface Payment {
  id: string;
  reference: string;
  status: 'pending' | 'success' | 'failed' | 'abandoned';
  amount: string;
  currency: string;
  channel: string;
  paid_at: string | null;
  created_at: string;
}
