import React, { useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, TEXT_SIZES } from "@/theme";

type Props = {
  isVisible?: boolean;
  toggleVisibility: () => void;
};

const ContentDeviderShowHistoryButton: React.FC<Props> = ({
  isVisible = false,
  toggleVisibility,
}) => {
  const [rotateAnim] = useState(new Animated.Value(isVisible ? 1 : 0));
  const [isRotated, setIsRotated] = useState(isVisible);

  const handlePress = () => {
    const toValue = isRotated ? 0 : 1;

    Animated.timing(rotateAnim, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setIsRotated(!isRotated);
    toggleVisibility();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View
      className="justify-center items-center w-full"
      style={{
        paddingHorizontal: parseInt(SPACING["padding-default"]),
      }}
    >
      <View className="flex-row items-center w-full">
        {/* Left line */}
        <View
          className="flex-1"
          style={{
            height: 1,
            backgroundColor: COLORS["border-light"],
          }}
        />

        {/* Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          className="flex-row items-center rounded-full border"
          style={{
            backgroundColor: COLORS["containerBackground-light"],
            borderColor: COLORS["border-light"],
            borderWidth: 1,
            paddingHorizontal: parseInt(SPACING["padding-md"]),
            paddingVertical: parseInt(SPACING["padding-sm"]),
            marginHorizontal: parseInt(SPACING["margin-sm"]),
          }}
        >
          <Animated.View
            className="justify-center items-center mr-1"
            style={{
              width: 16,
              height: 16,
              transform: [{ rotate: rotateInterpolate }],
            }}
          >
            <Ionicons
              name="chevron-down"
              size={16}
              color={COLORS["textSecondary-light"]}
            />
          </Animated.View>

          <Text
            className="font-medium"
            style={{
              fontSize: parseInt(TEXT_SIZES["text-md"]),
              color: COLORS["textSecondary-light"],
            }}
          >
            Show History
          </Text>
        </TouchableOpacity>

        {/* Right line */}
        <View
          className="flex-1"
          style={{
            height: 1,
            backgroundColor: COLORS["border-light"],
          }}
        />
      </View>
    </View>
  );
};

export default ContentDeviderShowHistoryButton;
