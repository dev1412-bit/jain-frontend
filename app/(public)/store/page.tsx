import StorePageClient from "./StorePageClient";
import { getStorefrontData } from "@/lib/api/storefront";

export default async function StorePage() {
  const { products, categories, error } = await getStorefrontData();

  return (
    <StorePageClient
      initialProducts={products}
      initialCategories={categories}
      initialError={error}
    />
  );
}
