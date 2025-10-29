import React, { FC, ReactNode, useState } from "react";
import { CategoriesContext } from "./categories-context";
import { Category } from "@/db/schema";

interface Props {
  children?: ReactNode;
}

export const CategoriesProvider: FC<Props> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  return (
    <CategoriesContext.Provider
      value={{ selectedCategory, setSelectedCategory }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
