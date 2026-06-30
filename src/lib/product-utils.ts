import { CATALOG_PRODUCTS, PRODUCT_IMAGES, type Product } from "@/data/catalog";

type LiveProduct = Product & {
  active?: boolean;
};

export function mergeInventoryProducts(inventory: LiveProduct[]): Product[] {
  const localById = new Map(CATALOG_PRODUCTS.map((product) => [product.id, product]));
  const inventoryIds = new Set(inventory.map((product) => product.id));
  const inactiveIds = new Set(
    inventory.filter((product) => product.active === false).map((product) => product.id),
  );

  const mergedInventory = inventory
    .filter((product) => product.active !== false)
    .map((product) => {
      const local = localById.get(product.id);
      const isAdminCreated = !local;
      return {
        ...local,
        ...product,
        img: product.img || local?.img || PRODUCT_IMAGES.masala,
        images: product.images?.length ? product.images : local?.images,
        description: product.description || local?.description || "",
        tag: product.tag || local?.tag || (isAdminCreated ? "New" : undefined),
        featured: product.featured ?? local?.featured ?? isAdminCreated,
        trending: product.trending ?? local?.trending ?? false,
      };
    });

  const localOnlyProducts = CATALOG_PRODUCTS.filter(
    (product) => !inventoryIds.has(product.id) && !inactiveIds.has(product.id),
  );

  return [...mergedInventory, ...localOnlyProducts];
}

export function productGallery(product: Product) {
  const images = [product.img, ...(product.images ?? [])].filter(Boolean);
  return Array.from(new Set(images.length ? images : [PRODUCT_IMAGES.masala]));
}

export function productDiscount(product: Product) {
  if (!product.mrp || product.mrp <= product.price) return 0;
  return Math.round(((product.mrp - product.price) / product.mrp) * 100);
}
