import { CategoryRecord } from "@/interfaces";
import React, { FC } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import CategoryCard from "./CategoryCard";

interface Props {
  categories: CategoryRecord[];
  isCategoryPage?: boolean;
  onNewCategory?: () => void;
  onCategoryPress?: (category: CategoryRecord) => void;
  onLongPress?: (category: CategoryRecord) => void;
}

export const CategoriesGrid: FC<Props> = ({
  categories,
  isCategoryPage = false,
  onNewCategory,
  onCategoryPress,
}) => {
  const router = useRouter();

  return (
    <View className="px-padding-md flex-row flex-wrap gap-gap-default">
      {categories.map((category) => (
        <CategoryCard
          key={category.categoryId}
          category={category}
          onPress={() => {
            if (isCategoryPage) onCategoryPress?.(category);
            else
              router.navigate(
                `/(tabs)/analysis/selectedCategory/${category.categoryId}`
              );
          }}
        />
      ))}

      {isCategoryPage && (
        <CategoryCard key={-1} isAddCategory onPress={onNewCategory} />
      )}
    </View>
  );
};

export default CategoriesGrid;
