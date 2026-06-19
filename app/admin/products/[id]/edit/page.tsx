"use client";
import { useParams } from "next/navigation";
import EditProductPage from "@/components/admin/product/EditProductPage";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <EditProductPage productId={id} />;
}