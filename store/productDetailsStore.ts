import { create } from "zustand";
import api from "@/lib/axios";

export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  period: string;
  features: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  rating: number;
  text: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  rating: number;
  ratingCount: number;
  images: string[];
  category: string;
  features: string[];
  plans: PricingPlan[];
};

// ── Global static data (same on every product page) ──
export const GLOBAL_TESTIMONIALS: Testimonial[] = [
  { id: "1", name: "Rahul Sharma",  role: "CEO, TechStartup",    avatar: "RS", color: "bg-pink-500",   rating: 5, text: "Incredible software — saved us weeks of development time. Support team is world class." },
  { id: "2", name: "Priya Mehta",   role: "Founder, GrowthCo",   avatar: "PM", color: "bg-purple-500", rating: 5, text: "Best investment we made for our business. The features are exactly what we needed." },
  { id: "3", name: "Arjun Patel",   role: "CTO, ScaleUp",        avatar: "AP", color: "bg-teal-500",   rating: 5, text: "Seamless onboarding and excellent documentation. Highly recommend to any growing team." },
];

export const GLOBAL_FAQS: FAQ[] = [
  { question: "What is included in the license?",               answer: "Your license includes full source code, lifetime updates for the purchased version, and 6 months of dedicated support." },
  { question: "Can I use this for multiple clients?",           answer: "Each license is for a single project. For multiple clients you'll need separate licenses or contact us for a bulk deal." },
  { question: "Do you offer customization services?",           answer: "Yes, our team offers custom development. Reach out via the support page to discuss your requirements." },
  { question: "Is there a free trial available?",               answer: "We offer a live demo for all our products. Contact our team to schedule a walkthrough." },
  { question: "What kind of support do you provide?",           answer: "We provide email and ticket-based support. Premium plans include priority support with faster response times." },
];

type ProductDetailStore = {
  product: ProductDetail | null;
  loading: boolean;
  error: string | null;
  selectedPlan: string;
  fetchProduct: (slug: string) => Promise<void>;
  setSelectedPlan: (id: string) => void;
  testimonials: Testimonial[];
  faqs: FAQ[];
  fetchCmsData: () => Promise<void>;
};

export const useProductDetailStore = create<ProductDetailStore>((set) => ({
  product: null,
  testimonials: [], // Initialize empty
  faqs: [],         // Initialize empty
  loading: false,
  error: null,
  selectedPlan: "",

  fetchCmsData: async () => {
    try {
      const res = await api.get('/cms/public');
      set({ 
        testimonials: res.data.testimonials, 
        faqs: res.data.faqs 
      });
    } catch (err) {
      console.error("Failed to fetch CMS data", err);
    }
  },

  fetchProduct: async (slug: string) => {
    set({ loading: true, error: null, product: null });
    try {
      const res = await api.get(`/products/${slug}`);
      const data = res.data.data ?? res.data;

      // map from ProductResource to ProductDetail
      const product: ProductDetail = {
        id:          data.id,
        name:        data.title,
        slug:        data.slug,
        tagline:     data.description ?? "",
        rating:      4.5,              // static for now — add ratings table later
        ratingCount: 0,
        images:      data.media?.length
                       ? data.media.map((m: any) => m.url)
                       : [],
        category:    data.category?.name ?? "",
        features:    data.features ?? [],
        plans:       data.pricingPlans?.map((p: any) => ({
          id:            String(p.id),
          name:          p.planName,
          price:         p.price,
          originalPrice: p.originalPrice ?? undefined,
          period:        p.period,
          badge:         p.originalPrice
                           ? `SAVE ₹${(p.originalPrice - p.price).toLocaleString("en-IN")}`
                           : undefined,
          features:      p.features ?? [],
        })) ?? [],
      };

      set({
        product,
        // default to first plan
        selectedPlan: product.plans[0]?.id ?? "",
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err?.response?.status === 404
          ? "Product not found"
          : "Failed to load product",
        loading: false,
      });
    }
  },

  setSelectedPlan: (id) => set({ selectedPlan: id }),
}));