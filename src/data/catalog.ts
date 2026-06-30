import jaggeryImg from "@/assets/catalog/jaggery-powder.png";
import masalaImg from "@/assets/catalog/masala-square.png";
import masalaMockupImg from "@/assets/catalog/menmitha-masalas.png";
import oilStoryImg from "@/assets/catalog/menmitha-oil.png";
import oilImg from "@/assets/catalog/oil-square.png";
import shikakaiImg from "@/assets/catalog/shikakai-powder.png";
import wheatImg from "@/assets/catalog/wheat-flour.png";
import kadalaiBannerImg from "@/assets/product-banners/kadalai.png";
import kambuBannerImg from "@/assets/product-banners/kambu.png";
import malliBannerImg from "@/assets/product-banners/malli.png";
import manjalBannerImg from "@/assets/product-banners/manjal.png";
import milagaiBannerImg from "@/assets/product-banners/milagai.png";
import naattuSarkaraiBannerImg from "@/assets/product-banners/naattu-sarkarai.png";
import ragiBannerImg from "@/assets/product-banners/ragi.png";
import sambarBannerImg from "@/assets/product-banners/sambar.png";
import shikakaiBannerImg from "@/assets/product-banners/shikakai.png";
import siruthaniyaBannerImg from "@/assets/product-banners/siruthaniya.png";
import wheatBannerImg from "@/assets/product-banners/wheat.png";

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
    price: 260,
    mrp: 260,
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
    price: 400,
    mrp: 400,
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
    tagline: "Pure & unrefined · 1 L",
    description:
      "Unrefined coconut oil with a clean aroma for cooking, hair care and home rituals.",
    unit: "1 L bottle",
    price: 400,
    mrp: 400,
    stock: 16,
    reserved: 3,
    reorderPoint: 10,
    img: oilImg,
    trending: true,
  },
  {
    id: "castor-oil-1l",
    sku: "MFP-OIL-CA-1L",
    name: "Castor Oil",
    category: "Cold-Pressed Oils",
    tagline: "Traditional oil · 1 L",
    description: "Pure castor oil prepared for traditional home and wellness use.",
    unit: "1 L bottle",
    price: 250,
    mrp: 250,
    stock: 20,
    reserved: 2,
    reorderPoint: 10,
    img: oilImg,
  },
  {
    id: "neem-oil-1l",
    sku: "MFP-OIL-NE-1L",
    name: "Neem Oil",
    category: "Cold-Pressed Oils",
    tagline: "Traditional oil · 1 L",
    description: "Naturally strong neem oil prepared for traditional household use.",
    unit: "1 L bottle",
    price: 500,
    mrp: 500,
    stock: 18,
    reserved: 2,
    reorderPoint: 10,
    img: oilImg,
  },
  {
    id: "jaggery-powder-500g",
    sku: "MFP-JAG-500",
    name: "Natural Jaggery Powder",
    category: "Jaggery & Sweeteners",
    tagline: "Chemical-free · 1 kg",
    description:
      "A clean, naturally sweet pantry staple made without bleaching agents or chemicals.",
    unit: "1 kg pack",
    price: 65,
    mrp: 65,
    stock: 58,
    reserved: 5,
    reorderPoint: 20,
    img: naattuSarkaraiBannerImg,
    images: [jaggeryImg],
    tag: "New",
    featured: true,
  },
  {
    id: "palm-jaggery-1kg",
    sku: "MFP-JAG-PALM-1K",
    name: "Palm Jaggery",
    category: "Jaggery & Sweeteners",
    tagline: "Traditional sweetener · 1 kg",
    description: "Naturally sweet palm jaggery for traditional drinks, sweets and home recipes.",
    unit: "1 kg pack",
    price: 250,
    mrp: 250,
    stock: 24,
    reserved: 2,
    reorderPoint: 10,
    img: naattuSarkaraiBannerImg,
  },
  {
    id: "jaggery-vellam-1kg",
    sku: "MFP-JAG-VEL-1K",
    name: "Jaggery Vellam",
    category: "Jaggery & Sweeteners",
    tagline: "Natural vellam · 1 kg",
    description: "Traditional jaggery vellam for everyday cooking and festive sweets.",
    unit: "1 kg pack",
    price: 65,
    mrp: 65,
    stock: 32,
    reserved: 3,
    reorderPoint: 12,
    img: jaggeryImg,
  },
  {
    id: "kambu-500g",
    sku: "MFP-MIL-KAM-500",
    name: "Natural Kambu",
    category: "Millets & Grains",
    tagline: "Pearl millet · 500 g",
    description: "Naturally sourced kambu with fibre-rich goodness for traditional meals.",
    unit: "500 g pack",
    price: 120,
    mrp: 150,
    stock: 34,
    reserved: 3,
    reorderPoint: 14,
    img: kambuBannerImg,
    tag: "New",
    featured: true,
  },
  {
    id: "ragi-flour-500g",
    sku: "MFP-MIL-RAG-500",
    name: "Ragi Maavu",
    category: "Millets & Grains",
    tagline: "Calcium-rich · 1 kg",
    description: "Fine ragi flour prepared for porridge, dosa batter and wholesome recipes.",
    unit: "1 kg pack",
    price: 60,
    mrp: 60,
    stock: 29,
    reserved: 2,
    reorderPoint: 12,
    img: ragiBannerImg,
    trending: true,
  },
  {
    id: "kadalai-flour-500g",
    sku: "MFP-FLR-KAD-500",
    name: "Kadalai Maavu",
    category: "Flours & Staples",
    tagline: "Protein-rich · 1 kg",
    description: "Gram flour made for snacks, batters and everyday traditional cooking.",
    unit: "1 kg pack",
    price: 120,
    mrp: 120,
    stock: 31,
    reserved: 3,
    reorderPoint: 12,
    img: kadalaiBannerImg,
    featured: true,
  },
  {
    id: "sambar-masala-200g",
    sku: "MFP-MAS-SAM-200",
    name: "Home-Made Sambar Masala",
    category: "Home-Made Masalas",
    tagline: "Small batch · 100 g",
    description: "Sun-dried spices ground in small batches for a warm South Indian sambar base.",
    unit: "100 g pouch",
    price: 40,
    mrp: 40,
    stock: 37,
    reserved: 7,
    reorderPoint: 16,
    img: sambarBannerImg,
    images: [masalaImg],
    featured: true,
  },
  {
    id: "milagai-powder-200g",
    sku: "MFP-MAS-MIL-200",
    name: "Milagai Thool",
    category: "Home-Made Masalas",
    tagline: "Natural chilli powder · 100 g",
    description: "Bright red chilli powder with natural aroma, colour and heat.",
    unit: "100 g pouch",
    price: 25,
    mrp: 25,
    stock: 26,
    reserved: 4,
    reorderPoint: 12,
    img: milagaiBannerImg,
    tag: "Hot",
    trending: true,
  },
  {
    id: "malli-powder-200g",
    sku: "MFP-MAS-MAL-200",
    name: "Malli Thool",
    category: "Home-Made Masalas",
    tagline: "Coriander powder · 100 g",
    description: "Fragrant coriander powder ground for everyday curries and spice blends.",
    unit: "100 g pouch",
    price: 25,
    mrp: 25,
    stock: 33,
    reserved: 3,
    reorderPoint: 14,
    img: malliBannerImg,
    featured: true,
  },
  {
    id: "manjal-powder-200g",
    sku: "MFP-MAS-MAN-200",
    name: "Manjal Thool",
    category: "Home-Made Masalas",
    tagline: "Natural turmeric · 100 g",
    description: "Golden turmeric powder with earthy aroma and natural colour.",
    unit: "100 g pouch",
    price: 25,
    mrp: 25,
    stock: 30,
    reserved: 3,
    reorderPoint: 14,
    img: manjalBannerImg,
    tag: "New",
    trending: true,
  },
  {
    id: "rasam-masala-200g",
    sku: "MFP-MAS-RAS-200",
    name: "Home-Made Rasam Masala",
    category: "Home-Made Masalas",
    tagline: "Sun-dried spices · 100 g",
    description: "Peppery, aromatic rasam powder balanced for quick weekday rasam and soups.",
    unit: "100 g pouch",
    price: 40,
    mrp: 40,
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
    price: 60,
    mrp: 60,
    stock: 63,
    reserved: 8,
    reorderPoint: 24,
    img: wheatBannerImg,
    images: [wheatImg],
    featured: true,
  },
  {
    id: "nutritional-flour-1kg",
    sku: "MFP-FLR-NUT-1K",
    name: "Nutritional Flour",
    category: "Flours & Staples",
    tagline: "Nutritious blend · 1 kg",
    description: "A wholesome nutritional flour blend for nourishing family meals.",
    unit: "1 kg pack",
    price: 400,
    mrp: 400,
    stock: 18,
    reserved: 2,
    reorderPoint: 8,
    img: siruthaniyaBannerImg,
    tag: "Premium",
  },
  {
    id: "fresh-idli-dosai-flour-1kg",
    sku: "MFP-FLR-IDL-1K",
    name: "Fresh Idli & Dosai Flour",
    category: "Flours & Staples",
    tagline: "Fresh batter flour · 1 kg",
    description: "Fresh flour mix prepared for soft idli and crisp dosai at home.",
    unit: "1 kg pack",
    price: 40,
    mrp: 40,
    stock: 28,
    reserved: 3,
    reorderPoint: 12,
    img: wheatImg,
  },
  {
    id: "siruthaniya-health-mix-500g",
    sku: "MFP-MIL-SIR-500",
    name: "Siruthaniya Maavu",
    category: "Millets & Grains",
    tagline: "Millet health mix · 1 kg",
    description: "A nourishing millet flour blend made with selected traditional grains.",
    unit: "1 kg pack",
    price: 150,
    mrp: 150,
    stock: 22,
    reserved: 2,
    reorderPoint: 10,
    img: siruthaniyaBannerImg,
    tag: "Premium",
    featured: true,
    trending: true,
  },
  {
    id: "shikakai-powder-200g",
    sku: "MFP-HRB-SHI-200",
    name: "Herbal Shikakai Powder",
    category: "Herbal Powders",
    tagline: "100% natural · 100 g",
    description: "Traditional shikakai powder prepared without synthetic fragrance or fillers.",
    unit: "100 g pouch",
    price: 25,
    mrp: 25,
    stock: 12,
    reserved: 2,
    reorderPoint: 12,
    img: shikakaiBannerImg,
    images: [shikakaiImg],
    trending: true,
  },
  {
    id: "groundnuts-1kg",
    sku: "MFP-NUT-GN-1K",
    name: "Groundnuts",
    category: "Nuts",
    tagline: "Whole groundnuts · 1 kg",
    description: "Clean whole groundnuts for snacks, chutneys and everyday cooking.",
    unit: "1 kg pack",
    price: 160,
    mrp: 160,
    stock: 35,
    reserved: 3,
    reorderPoint: 14,
    img: oilImg,
  },
  {
    id: "ragi-semiya-pack",
    sku: "MFP-SEM-RAG-PK",
    name: "Ragi Semiya",
    category: "Semiya",
    tagline: "Ragi semiya · 1 pack",
    description: "Ragi semiya for quick, wholesome breakfast and tiffin recipes.",
    unit: "1 pack",
    price: 23,
    mrp: 23,
    stock: 40,
    reserved: 4,
    reorderPoint: 16,
    img: ragiBannerImg,
  },
  {
    id: "normal-semiya-pack",
    sku: "MFP-SEM-NOR-PK",
    name: "Normal Semiya",
    category: "Semiya",
    tagline: "Classic semiya · 1 pack",
    description: "Classic semiya for upma, payasam and quick home dishes.",
    unit: "1 pack",
    price: 18,
    mrp: 18,
    stock: 40,
    reserved: 4,
    reorderPoint: 16,
    img: wheatImg,
  },
  {
    id: "tomato-semiya-pack",
    sku: "MFP-SEM-TOM-PK",
    name: "Tomato Semiya",
    category: "Semiya",
    tagline: "Tomato semiya · 1 pack",
    description: "Tomato-flavoured semiya for a quick savoury tiffin.",
    unit: "1 pack",
    price: 25,
    mrp: 25,
    stock: 40,
    reserved: 4,
    reorderPoint: 16,
    img: sambarBannerImg,
  },
];

export const PRODUCT_IMAGES = {
  jaggery: jaggeryImg,
  shikakai: shikakaiImg,
  wheat: wheatImg,
  oil: oilImg,
  masala: masalaImg,
  kadalai: kadalaiBannerImg,
  kambu: kambuBannerImg,
  malli: malliBannerImg,
  manjal: manjalBannerImg,
  milagai: milagaiBannerImg,
  naattuSarkarai: naattuSarkaraiBannerImg,
  ragi: ragiBannerImg,
  sambar: sambarBannerImg,
  siruthaniya: siruthaniyaBannerImg,
  oilStory: oilStoryImg,
  masalaStory: masalaMockupImg,
};

export const BEST_SELLERS = CATALOG_PRODUCTS.filter((product) => product.featured);
export const TRENDING = CATALOG_PRODUCTS.filter((product) => product.trending);

export const PRODUCT_BY_ID = new Map(CATALOG_PRODUCTS.map((product) => [product.id, product]));
