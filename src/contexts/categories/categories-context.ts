import { createContext, useContext } from "react";
import { Category } from "@/db/schema";

export type CategoriesContextType = {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
};

export const CategoriesContext = createContext<CategoriesContextType>({
  selectedCategory: null,
  setSelectedCategory: () => {},
});

export const useCategories = () => useContext(CategoriesContext);
