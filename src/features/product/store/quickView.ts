import { create } from "zustand";
import { ProductCardData } from "../components/ProductCard";

interface QuickViewStore {
  product: ProductCardData | null;
  isOpen: boolean;
  open: (product: ProductCardData) => void;
  close: () => void;
}

export const useQuickViewStore = create<QuickViewStore>((set) => ({
  product: null,
  isOpen: false,
  open: (product) => set({ product, isOpen: true }),
  close: () => set({ isOpen: false }),
}));
