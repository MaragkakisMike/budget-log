import { FC, useCallback, useRef } from "react";
import { View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import Container from "@/components/Container";
import { CardContainer } from "@/components/CardContainer";
import { CategoryDetails } from "@/features/categories/CategoryDetails";
import { getCategories } from "@/db/queries/categories";
import useDatabase from "@/hooks/useDatabase";
import { useCategories } from "@/contexts/categories/categories-context";
import CategoriesGrid from "@/features/analysis/CategoriesGrid";
import { CategoryRecord } from "@/interfaces";

const Categories: FC = () => {
  const drizzleDB = useDatabase();
  const { setSelectedCategory } = useCategories();
  const categoryBottomSheetRef = useRef<BottomSheetModal>(null);
  const { t } = useTranslation();
  const { data: categories } = useLiveQuery(getCategories(drizzleDB));

  const toggleBottomSheet = () => {
    categoryBottomSheetRef.current?.present();
  };

  const handleCategorySelection = useCallback(
    (category) => {
      setSelectedCategory(category);
      categoryBottomSheetRef.current?.present();
    },
    [setSelectedCategory]
  );

  const filterCategories = () => {
    if (!categories) return [];
    return categories.map((category) => ({
      ...category,
      categoryId: category.id,
      categoryName: category.name,
      type: "",
      totalAmount: 0,
    })) as CategoryRecord[];
  };

  return (
    <Container>
      <View className="px-padding-md pt-padding-md">
        <CardContainer title={t("categories.categories")} />
      </View>

      <CategoriesGrid
        categories={filterCategories()}
        onNewCategory={toggleBottomSheet}
        onCategoryPress={handleCategorySelection}
        isCategoryPage
      />

      <CategoryDetails categoryBottomSheetRef={categoryBottomSheetRef} />
    </Container>
  );
};

export default Categories;
