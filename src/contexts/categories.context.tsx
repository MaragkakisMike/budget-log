import { createContext, useContext, useState, FC, ReactNode } from "react";
import { Category } from "@/db/schema";

type CategoriesContextType = {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
};

const CategoriesContext = createContext<CategoriesContextType>({
  selectedCategory: null,
  setSelectedCategory: () => {},
});

export const CategoriesProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  return (
    <CategoriesContext.Provider
      value={{ selectedCategory, setSelectedCategory }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => useContext(CategoriesContext);
