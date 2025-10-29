import { Text, View, Switch } from "react-native";
import { useColorScheme } from "nativewind";
import SafePageView from "@/components/SafePageView";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <SafePageView>
      <View className="py-10 px-6 md:px-8">
        <View className="flex flex-col items-center gap-6 text-center">
          <Text
            role="heading"
            className="text-primary dark:text-primary-dark text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            Expo + NativeWind (Tailwind) Template
          </Text>

          <Text className="mx-auto max-w-[700px] text-lg md:text-xl text-accent dark:text-accent-dark">
            A minimal Expo starter project with Tailwind styling using
            NativeWind. Perfect as a base for your next React Native app.
          </Text>

          <View className="flex flex-row justify-center items-center gap-3 space-x-2">
            <Text className="text-xl text-text-primary dark:text-text-primary-dark">
              {t("general.overview")}
            </Text>
            <Switch
              value={colorScheme === "light"}
              onChange={toggleColorScheme}
            />
          </View>
        </View>
      </View>
    </SafePageView>
  );
}
