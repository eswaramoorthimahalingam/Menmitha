import jaggeryImg from "@/assets/catalog/jaggery-powder.png";
import masalaImg from "@/assets/catalog/masala-square.png";
import masalaMockupImg from "@/assets/catalog/menmitha-masalas.png";
import oilStoryImg from "@/assets/catalog/menmitha-oil.png";
import oilImg from "@/assets/catalog/oil-square.png";
import shikakaiImg from "@/assets/catalog/shikakai-powder.png";
import wheatImg from "@/assets/catalog/wheat-flour.png";

export type ProductCategory = string;

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  unit: string;
  price: number;
  mrp?: number;
  stock: number;
  reserved: number;
  reorderPoint: number;
  img: string;
  images?: string[];
  tag?: string;
  featured?: boolean;
  trending?: boolean;
};

export type CartLine = {
  productId: string;
  quantity: number;
};

export type OrderStatus =
  | "new"
  | "accepted"
  | "packing"
  | "ready"
  | "shipped"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
  items: Array<{
    productId: string;
    sku: string;
    name: string;
    unit: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
};

export const CATALOG_PRODUCTS: Product[] = [
  {
    id: "groundnut-oil-1l",
    sku: "MFP-OIL-GN-1L",
    name: "Cold-Pressed Groundnut Oil",
    category: "Cold-Pressed Oils",
    tagline: "Wooden chekku · 1 L",
    description: "Slow-pressed in a wooden chekku to preserve aroma, body and natural nutrition.",
    unit: "1 L bottle",
    price: 420,
    mrp: 520,
    stock: 42,
    reserved: 6,
    reorderPoint: 18,
    img: oilImg,
    tag: "Best Seller",
    featured: true,
    trending: true,
  },
  {
    id: "sesame-oil-1l",
    sku: "MFP-OIL-SE-1L",
    name: "Cold-Pressed Sesame Oil",
    category: "Cold-Pressed Oils",
    tagline: "Wooden chekku · 1 L",
    description:
      "A rich, nutty sesame oil made for everyday cooking, pickles and traditional recipes.",
    unit: "1 L bottle",
    price: 480,
    mrp: 580,
    stock: 24,
    reserved: 4,
    reorderPoint: 12,
    img: oilImg,
    tag: "Trending",
    trending: true,
  },
  {
    id: "coconut-oil-500ml",
    sku: "MFP-OIL-CO-500",
    name: "Cold-Pressed Coconut Oil",
    category: "Cold-Pressed Oils",
    tagline: "Pure & unrefined · 500 ml",
    description:
      "Unrefined coconut oil with a clean aroma for cooking, hair care and home rituals.",
    unit: "500 ml bottle",
    price: 350,
    mrp: 420,
    stock: 16,
    reserved: 3,
    reorderPoint: 10,
    img: oilImg,
    trending: true,
  },
  {
    id: "jaggery-powder-500g",
    sku: "MFP-JAG-500",
    name: "Natural Jaggery Powder",
    category: "Jaggery & Sweeteners",
    tagline: "Chemical-free · 500 g",
    description:
      "A clean, naturally sweet pantry staple made without bleaching agents or chemicals.",
    unit: "500 g pack",
    price: 180,
    mrp: 220,
    stock: 58,
    reserved: 5,
    reorderPoint: 20,
    img: jaggeryImg,
    tag: "New",
    featured: true,
  },
  {
    id: "sambar-masala-200g",
    sku: "MFP-MAS-SAM-200",
    name: "Home-Made Sambar Masala",
    category: "Home-Made Masalas",
    tagline: "Small batch · 200 g",
    description: "Sun-dried spices ground in small batches for a warm South Indian sambar base.",
    unit: "200 g pouch",
    price: 145,
    mrp: 175,
    stock: 37,
    reserved: 7,
    reorderPoint: 16,
    img: masalaImg,
    featured: true,
  },
  {
    id: "rasam-masala-200g",
    sku: "MFP-MAS-RAS-200",
    name: "Home-Made Rasam Masala",
    category: "Home-Made Masalas",
    tagline: "Sun-dried spices · 200 g",
    description: "Peppery, aromatic rasam powder balanced for quick weekday rasam and soups.",
    unit: "200 g pouch",
    price: 135,
    mrp: 170,
    stock: 21,
    reserved: 4,
    reorderPoint: 14,
    img: masalaImg,
    trending: true,
  },
  {
    id: "wheat-flour-1kg",
    sku: "MFP-FLR-WHT-1K",
    name: "Stone-Ground Wheat Flour",
    category: "Flours & Staples",
    tagline: "Whole wheat · 1 kg",
    description: "Stone-ground whole wheat flour milled for soft chapatis and everyday baking.",
    unit: "1 kg pack",
    price: 95,
    mrp: 120,
    stock: 63,
    reserved: 8,
    reorderPoint: 24,
    img: wheatImg,
    featured: true,
  },
  {
    id: "shikakai-powder-200g",
    sku: "MFP-HRB-SHI-200",
    name: "Herbal Shikakai Powder",
    category: "Herbal Powders",
    tagline: "100% natural · 200 g",
    description: "Traditional shikakai powder prepared without synthetic fragrance or fillers.",
    unit: "200 g pouch",
    price: 160,
    mrp: 200,
    stock: 12,
    reserved: 2,
    reorderPoint: 12,
    img: shikakaiImg,
    trending: true,
  },
];

export const PRODUCT_IMAGES = {
  jaggery: jaggeryImg,
  shikakai: shikakaiImg,
  wheat: wheatImg,
  oil: oilImg,
  masala: masalaImg,
  oilStory: oilStoryImg,
  masalaStory: masalaMockupImg,
};

export const BEST_SELLERS = CATALOG_PRODUCTS.filter((product) => product.featured);
export const TRENDING = CATALOG_PRODUCTS.filter((product) => product.trending);

export const PRODUCT_BY_ID = new Map(CATALOG_PRODUCTS.map((product) => [product.id, product]));
