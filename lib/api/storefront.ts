import type { Product, StoreCategory } from "@/store/productStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const STORE_REVALIDATE_SECONDS = 60;

type ApiCollection<T> = {
  data?: T[];
};

async function fetchCollection<T>(path: string): Promise<T[]> {
  const response = await fetch(`${API_URL}${path}`, {
    next: { revalidate: STORE_REVALIDATE_SECONDS },
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }

  const payload = (await response.json()) as ApiCollection<T> | T[];
  return Array.isArray(payload) ? payload : payload.data ?? [];
}

export async function getStorefrontData(): Promise<{
  products: Product[];
  categories: StoreCategory[];
  error: string | null;
}> {
  const [productsResult, categoriesResult] = await Promise.allSettled([
    fetchCollection<Product>("/products?status=published&per_page=100"),
    fetchCollection<StoreCategory>("/categories"),
  ]);

  return {
    products: productsResult.status === "fulfilled" ? productsResult.value : [],
    categories:
      categoriesResult.status === "fulfilled"
        ? categoriesResult.value.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
          }))
        : [],
    error:
      productsResult.status === "rejected"
        ? "Failed to load products"
        : null,
  };
}
