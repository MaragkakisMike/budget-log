import { Tabs } from "expo-router";
import React, { useState } from "react";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "nativewind";
import { COLORS, SPACING } from "@/theme";
import SafePageView from "@/components/SafePageView";
import ActionsModal from "@/components/ActionModal";

export default function RootTabs() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => setIsModalVisible((prev) => !prev);

  return (
    <SafePageView colorScheme={colorScheme}>
      <ActionsModal isModalVisible={isModalVisible} toggleModal={toggleModal} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor:
              colorScheme === "dark"
                ? COLORS["containerBackground-dark"]
                : COLORS["containerBackground-light"],
            height: Platform.OS === "ios" ? 0 : 60,
            paddingHorizontal: parseInt(SPACING["padding-default"]),
            paddingTop: parseInt(SPACING["padding-md"]),
            elevation: Platform.OS === "android" ? 10 : 0,
          },
        }}
      >
        {/* Home */}
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => (
              <View className="flex-1 items-center justify-center min-w-[50px] max-w-[80px]">
                <FontAwesome
                  name="home"
                  size={24}
                  color={focused ? COLORS.primary : COLORS.gray}
                />
                <Text
                  numberOfLines={1}
                  className={`text-[10px] text-center w-full ${
                    focused ? "text-primary font-semibold" : "text-gray"
                  }`}
                >
                  {t("navigation.home")}
                </Text>
              </View>
            ),
          }}
        />

        {/* Analysis */}
        <Tabs.Screen
          name="analysis"
          options={{
            tabBarIcon: ({ focused }) => (
              <View className="flex-1 items-center justify-center min-w-[50px] max-w-[80px]">
                <FontAwesome
                  name="line-chart"
                  size={24}
                  color={focused ? COLORS.primary : COLORS.gray}
                />
                <Text
                  numberOfLines={1}
                  className={`text-[10px] text-center w-full ${
                    focused ? "text-primary font-semibold" : "text-gray"
                  }`}
                >
                  {t("navigation.analytics")}
                </Text>
              </View>
            ),
            popToTopOnBlur: true,
          }}
        />

        {/* Add button */}
        <Tabs.Screen
          name="add"
          options={{
            tabBarButton: () => (
              <View className="absolute ios:bottom-[-25px] bottom-margin-default w-full items-center justify-center">
                <TouchableOpacity
                  className="w-[60px] h-[60px] rounded-full items-center justify-center shadow-md"
                  style={{
                    backgroundColor: COLORS.primary,
                  }}
                  onPress={toggleModal}
                >
                  <FontAwesome5 name="plus" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        {/* Categories */}
        <Tabs.Screen
          name="categories"
          options={{
            tabBarIcon: ({ focused }) => (
              <View className="flex-1 items-center justify-center min-w-[50px] max-w-[80px]">
                <Ionicons
                  name="grid"
                  size={24}
                  color={focused ? COLORS.primary : COLORS.gray}
                />
                <Text
                  numberOfLines={1}
                  className={`text-[10px] text-center w-full ${
                    focused ? "text-primary font-semibold" : "text-gray"
                  }`}
                >
                  {t("navigation.categories")}
                </Text>
              </View>
            ),
          }}
        />

        {/* Settings */}
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ focused }) => (
              <View className="flex-1 items-center justify-center min-w-[50px] max-w-[80px]">
                <FontAwesome
                  name="cog"
                  size={24}
                  color={focused ? COLORS.primary : COLORS.gray}
                />
                <Text
                  numberOfLines={1}
                  className={`text-[10px] text-center w-full ${
                    focused ? "text-primary font-semibold" : "text-gray"
                  }`}
                >
                  {t("navigation.settings")}
                </Text>
              </View>
            ),
          }}
        />

        {/* Hidden index */}
        <Tabs.Screen name="index" options={{ href: null }} />
      </Tabs>
    </SafePageView>
  );
}
