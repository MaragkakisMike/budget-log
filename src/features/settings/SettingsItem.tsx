import React from "react";
import {
  View,
  Text,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { cn } from "@/utils";

interface SettingsItemProps extends Omit<PressableProps, "style"> {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  leftIcon?: React.ReactNode;
  showDivider?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  padding?: "default" | "sm";
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  subtitle,
  rightElement,
  leftIcon,
  showDivider = true,
  containerStyle,
  titleStyle,
  subtitleStyle,
  padding = "default",
  ...pressableProps
}) => {
  return (
    <View
      style={containerStyle}
      className="w-full bg-containerBackground-light dark:bg-containerBackground-dark"
    >
      <Pressable
        {...pressableProps}
        className={cn(
          `p-padding-${padding}`,
          padding === "sm" && "px-padding-default"
        )}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      >
        <View className="flex-row items-center gap-gap-sm">
          {leftIcon && <View className="">{leftIcon}</View>}

          <View className="flex-1">
            <Text
              style={titleStyle}
              className="text-[16px] font-medium text-textPrimary-light dark:text-textPrimary-dark"
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={subtitleStyle}
                className="text-[14px] mt-[${EXTRA_SMALL_MARGIN}px] text-textSecondary-light dark:text-textSecondary-dark"
              >
                {subtitle}
              </Text>
            )}
          </View>

          {rightElement && <View className="">{rightElement}</View>}
        </View>
      </Pressable>

      {showDivider && (
        <View className="h-[1px] bg-divider opacity-5 ml-margin-default" />
      )}
    </View>
  );
};

export default SettingsItem;
