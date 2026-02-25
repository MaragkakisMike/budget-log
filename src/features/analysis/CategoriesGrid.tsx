import { CategoryRecord } from "@/interfaces";
import { FC } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import CategoryCard from "./CategoryCard";
import { useBottomSheet } from "@/contexts/bottomSheet.context";

interface Props {
  categories: CategoryRecord[];
  isCategoryPage?: boolean;
  onCategoryPress?: (category: CategoryRecord) => void;
  onLongPress?: (category: CategoryRecord) => void;
}

export const CategoriesGrid: FC<Props> = ({
  categories,
  isCategoryPage = false,
  onCategoryPress,
}) => {
  const { onSheetOpen } = useBottomSheet();
  const router = useRouter();

  return (
    <View className="px-padding-md flex-row flex-wrap gap-gap-default">
      {categories.map((category) => (
        <CategoryCard
          key={category.categoryId}
          category={category}
          onPress={() => {
            if (isCategoryPage) {
              onSheetOpen();
              onCategoryPress?.(category);
            } else
              router.navigate(
                `/(tabs)/analysis/selectedCategory/${category.categoryId}`,
              );
          }}
        />
      ))}

      {isCategoryPage && (
        <CategoryCard key={-1} isAddCategory onPress={onSheetOpen} />
      )}
    </View>
  );
};

export default CategoriesGrid;
