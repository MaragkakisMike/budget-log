import React from "react";
import { Pressable, Text } from "react-native";
import type { PressableProps } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { cn } from "@/utils";
import { COLORS } from "@/theme";

interface ButtonProps extends PressableProps {
  title: string;
  icon?: keyof typeof FontAwesome5.glyphMap;
  iconPlacement?: "left" | "right";
  width?: "full" | "flex";
  variant?: "primary" | "secondary" | "outline" | "outlineDanger";
  style?: object;
  disabled?: boolean;
}

export const Button = ({
  title,
  icon,
  iconPlacement = "right",
  width = "flex",
  variant = "primary",
  style,
  disabled = false,
  ...props
}: ButtonProps) => {
  return (
    <Pressable
      disabled={disabled}
      className={cn(
        "rounded-xl shadow-md flex-row items-center justify-center px-padding-lg py-padding-md",
        width === "full" && "w-full",
        width === "flex" && "flex-1",
        variant === "primary" && "bg-primary",
        variant === "secondary" && "bg-secondary-light dark:bg-secondary-dark",
        variant === "outline" &&
          "bg-containerBackground-light dark:bg-containerBackground-dark border-2 border-primary",
        variant === "outlineDanger" &&
          "bg-containerBackground-light dark:bg-containerBackground-dark border-2 border-red",
        disabled && "opacity-50"
      )}
      style={({ pressed }) => [
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
        style,
      ]}
      {...props}
    >
      {icon && iconPlacement === "left" && (
        <FontAwesome5
          name={icon}
          size={20}
          style={{
            color: COLORS[variant === "outlineDanger" ? "red" : "primary"],
            marginRight: 8,
          }}
        />
      )}

      <Text
        className={cn(
          "text-text-default font-semibold text-center",
          variant === "outline" && "text-primary",
          variant === "outlineDanger" && "text-red",
          variant !== "outline" && variant !== "outlineDanger" && "text-white"
        )}
      >
        {title}
      </Text>

      {icon && iconPlacement === "right" && (
        <FontAwesome5
          name={icon}
          size={20}
          style={{
            color: COLORS[variant === "outlineDanger" ? "red" : "primary"],
            marginLeft: 8,
          }}
        />
      )}
    </Pressable>
  );
};

export default Button;
