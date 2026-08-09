export type ProductType = 'light' | 'appliance';

export type ShopOrigin = 'lighthouse' | 'electrical_shop' | 'both';

export type StockStatus = 'in_stock' | 'low_stock' | 'on_order' | 'out_of_stock';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  type: ProductType;
  shopOrigin: ShopOrigin;
  category: string;
  originalPrice: number;
  discountPrice?: number;
  isFeatured?: boolean;
  stockStatus: StockStatus;
  stockQuantity: number;
  imageUrl: string;
  additionalImages?: string[];
  description: string;
  specifications: ProductSpecification[];
  tags: string[];
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoreInfo {
  id: ShopOrigin;
  name: string;
  tagline: string;
  address: string;
  city: string;
  mapsUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  operatingHours: string;
  specialties: string[];
  bannerImage: string;
}

export interface QuoteItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface QuoteRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  preferredStore: ShopOrigin;
  items: {
    productId: string;
    productTitle: string;
    price: number;
    quantity: number;
    shopOrigin: ShopOrigin;
  }[];
  totalAmount: number;
  totalSavings: number;
  notes?: string;
  status: 'pending' | 'contacted' | 'fulfilled' | 'cancelled';
  createdAt: string;
}

export type FilterCategory = 'all' | string;
