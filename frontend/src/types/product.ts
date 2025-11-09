export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  short: string;
  cover: string;        // URL to cover image
  is_active: boolean;
  order: number;
  created_at: string;
}

export interface ProductImage {
  id: number;
  image: string;        // URL to image
  alt_text?: string;
}

export interface ProductDetail extends Product {
  description: string;
  images: ProductImage[];
  material?: string;
  delivery_info?: string;
}
