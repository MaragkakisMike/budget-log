import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { useTranslation } from "react-i18next";

export function EditModeFloatingChip({ isVisible }: { isVisible: boolean }) {
  const { t } = useTranslation();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isVisible, pulseAnim]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={{
        width: 100,
        transform: [{ scale: pulseAnim }],
      }}
      className="bg-primary/60 rounded-full px-3 py-1.5 shadow-lg mb-4"
    >
      <View className="flex-row items-center">
        <FontAwesome5 name="pen" size={10} color="white" />
        <Text className="ml-1 text-white text-xs font-semibold">
          {t("form.editing")}
        </Text>
      </View>
    </Animated.View>
  );
}

export default EditModeFloatingChip;
