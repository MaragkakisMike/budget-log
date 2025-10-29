import { CategoryIcon } from "@/components/CategoryIcon";
import { CategoryRecord } from "@/interfaces";
import React, { FC } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { cn } from "@/utils";
import { useTranslation } from "react-i18next";

interface CategoryCardProps {
  category?: CategoryRecord;
  isAddCategory?: boolean;
  onPress?: () => void;
  onLongPress?: (category) => void;
}

const { width: screenWidth } = Dimensions.get("window");
const cardWidth = (screenWidth - 40) / 2;

export const CategoryCard: FC<CategoryCardProps> = ({
  category,
  isAddCategory = false,
  onPress,
  onLongPress,
}) => {
  const { t } = useTranslation();
  if (isAddCategory) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={{ width: cardWidth, minHeight: 110 }}
        className={cn(
          "bg-containerBackground-light dark:bg-containerBackground-dark rounded-2xl relative shadow",
          "pt-padding-sm justify-center gap-gap-sm"
        )}
      >
        <View className="flex-row justify-center items-center">
          <View className="justify-center items-center rounded-full border border-[#ccc] bg-[#f0f0f0] p-padding-md">
            <CategoryIcon
              category={{ icon: "plus", color: "#ccc" }}
              size="xs"
            />
          </View>
        </View>
        <View className="justify-center items-center px-padding-lg pb-padding-md">
          <Text className="text-textSecondary-light dark:text-textSecondary-dark text-base font-medium">
            {t("categories.add_new_category")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={() => {
        if (onLongPress) onLongPress(category);
      }}
      activeOpacity={0.8}
      style={{ width: cardWidth, minHeight: 110 }}
      className="bg-containerBackground-light dark:bg-containerBackground-dark rounded-2xl relative shadow"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <View className="justify-center items-center rounded-full p-padding-md">
          <CategoryIcon
            category={{
              icon: category.icon,
              color: category.color,
            }}
            size="md"
          />
        </View>
      </View>

      {/* Percentage badge for expenses */}
      {category.type === "expense" && (
        <View
          className="absolute right-0 rounded-3xl border-b-0 px-padding-default py-padding-md w-[65px]"
          style={{
            top: -5,
            backgroundColor: "rgba(74, 144, 226, 0.1)", // fallback for primaryLight
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Text className="text-primary text-sm font-semibold text-center">
            {category.percentage || 0}%
          </Text>
        </View>
      )}

      {/* Info section */}
      <View className="px-padding-lg pb-padding-md">
        {category.totalAmount ? (
          <Text className="text-textPrimary-light dark:text-textPrimary-dark text-2xl font-bold mb-margin-xs">
            {category.totalAmount}€
          </Text>
        ) : null}
        <Text className="text-textSecondary-light dark:text-textSecondary-dark text-base font-medium">
          {category.categoryName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryCard;
