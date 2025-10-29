import React, { FC } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomProps {
  title?: string;
  children?: React.ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
  handleCardHeaderAction?: () => void;
}

export const CardContainer: FC<CustomProps> = ({
  title,
  children,
  icon,
  handleCardHeaderAction,
}) => {
  return (
    <View
      className={`
        bg-containerBackground-light dark:bg-containerBackground-dark
        rounded-2xl p-padding-default
        shadow-md items-center justify-center
      `}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between w-full">
        {title && (
          <Text className="text-text-2xl text-textPrimary-light dark:text-textPrimary-dark self-start">
            {title}
          </Text>
        )}
        {icon &&
          (handleCardHeaderAction ? (
            <Pressable onPress={handleCardHeaderAction}>
              <Ionicons
                name={icon}
                size={30}
                className="text-textPrimary-light dark:text-textPrimary-dark"
              />
            </Pressable>
          ) : (
            <Ionicons
              name={icon}
              size={30}
              className="text-textPrimary-light dark:text-textPrimary-dark"
            />
          ))}
      </View>

      {/* Children */}
      {children}
    </View>
  );
};

export default CardContainer;
