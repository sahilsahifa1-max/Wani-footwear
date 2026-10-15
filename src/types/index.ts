export type Audience = 'men' | 'women' | 'kids' | 'toddler' | 'seniors' | 'universal';

export type FootwearCategory =
  | 'running'
  | 'sports'
  | 'sneakers'
  | 'chunky-sneakers'
  | 'casual'
  | 'formal'
  | 'loafers'
  | 'boots'
  | 'sandals'
  | 'slippers'
  | 'slides'
  | 'ethnic'
  | 'first-steps'
  | 'school-shoes'
  | 'comfort-walking';

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  audience: Audience;
  category: FootwearCategory;
  footwearType: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  inStock: boolean;
  stockCount: number;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  material?: string;
  sole?: string;
  careInstructions?: string;
  images: string[];
  badge?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type FulfilmentType = 'store-pickup' | 'local-delivery' | 'pan-india-shipping';

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email: string;
  address?: string;
  locality?: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Ready for pickup'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export type PaymentMethod = 'cod' | 'pay-at-store' | 'online-upi-card';

export interface Order {
  id: string; // e.g., VF-2026-8812
  createdAt: string;
  customer: OrderCustomer;
  items: CartItem[];
  fulfilmentType: FulfilmentType;
  fulfilmentFee: number;
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  taxAmount: number; // 12% GST
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid' | 'Pay on Pickup/Delivery';
  status: OrderStatus;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface ProductFilter {
  searchQuery: string;
  audience: Audience | 'all';
  category: FootwearCategory | 'all';
  size: string | 'all';
  color: string | 'all';
  priceMin: number;
  priceMax: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}

export interface AboutImageConfig {
  ownerPortrait: string;
  storefront: string;
  interior: string;
  footwearDisplay: string;
  teamPhoto: string;
  additionalGalleryImages: string[];
}
