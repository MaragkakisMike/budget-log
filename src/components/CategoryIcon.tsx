import React from "react";
import { View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { cn } from "@/utils";

export const CategoryIcon = ({ category, size = "sm" }) => {
  const sizeClasses = {
    xs: "w-[25px] h-[25px]",
    sm: "w-10 h-10", // 40px
    md: "w-[50px] h-[50px]",
  };

  return (
    <View
      className={cn(
        "justify-center items-center rounded-full m-margin-xs bg-transparent",
        sizeClasses[size]
      )}
      style={{ backgroundColor: `${category.color}20` }}
    >
      <FontAwesome5 name={category.icon} size={20} color={category.color} />
    </View>
  );
};

export default CategoryIcon;
