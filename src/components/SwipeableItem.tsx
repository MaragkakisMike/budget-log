import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { COLORS } from "@/theme";

const DeleteSwipeAction = (bgColor: string) => {
  return (
    <LinearGradient
      colors={["#f00", bgColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.99, y: 0 }}
      locations={[0.2, 1]}
      className="flex-1 justify-center items-end rounded-2xl px-4"
    >
      <MaterialCommunityIcons
        name="delete-forever"
        size={30}
        color={COLORS.red}
      />
    </LinearGradient>
  );
};

const SwipeableItem = ({
  onRightSwipe,
  onPress,
  children,
}: {
  onRightSwipe?: () => void;
  onPress?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Swipeable
      renderRightActions={() =>
        DeleteSwipeAction(COLORS["containerBackground-light"])
      }
      onSwipeableOpen={(direction) => {
        if (direction === "right") {
          onRightSwipe?.();
        }
      }}
    >
      <Pressable onPress={onPress}>{children}</Pressable>
    </Swipeable>
  );
};

export default SwipeableItem;
