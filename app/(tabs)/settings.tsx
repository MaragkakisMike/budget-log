import React from "react";
import { View, Text, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Container from "@/components/Container";
import { useTranslation } from "react-i18next";
import { languages } from "@/services/i18next";
import SettingsItem from "@/features/settings/SettingsItem";
import { VERSION } from "@/constants";
import { COLORS } from "@/theme";
import { useColorScheme } from "nativewind";
import CardContainer from "@/components/CardContainer";

interface LanguageItem {
  name: string;
  nativeName?: string;
  flag?: string;
}
interface LanguageList {
  [key: string]: LanguageItem;
}

const Settings: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const { t, i18n } = useTranslation();
  const typedLanguages = languages as LanguageList;

  const renderLanguageOptions = () => (
    <View className="w-full gap-gap-sm bg-background-light dark:bg-background-dark">
      {Object.keys(typedLanguages).map((lng, index) => (
        <SettingsItem
          key={lng}
          title={typedLanguages[lng].name}
          showDivider={index < Object.keys(typedLanguages).length - 1}
          rightElement={
            i18n.language === lng ? (
              <Ionicons name="checkmark" size={20} color={COLORS.primary} />
            ) : null
          }
          titleStyle={
            i18n.language === lng
              ? { color: COLORS.primary, fontWeight: "600" }
              : undefined
          }
          onPress={() => i18n.changeLanguage(lng)}
        />
      ))}
    </View>
  );
  return (
    <Container className="px-padding-md" noRefresh>
      <View className="pt-padding-default">
        <CardContainer title={t("settings.settings")} />
      </View>

      <View className="gap-gap-lg">
        {/* Dark mode */}
        <View>
          <Text className="text-[14px] font-semibold text-textSecondary-light dark:text-textSecondary-dark mb-margin-md ml-margin-sm">
            {t("settings.appearance")}
          </Text>
          <View className="rounded-xl overflow-hidden">
            <SettingsItem
              title={t("settings.toggle_dark_mode")}
              leftIcon={
                <Ionicons
                  name={isDarkMode ? "moon" : "sunny"}
                  size={20}
                  color={COLORS.primary}
                />
              }
              rightElement={
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleColorScheme}
                  trackColor={{
                    false: COLORS["trackOffColor-light"],
                    true: COLORS["trackOnColor"],
                  }}
                  thumbColor={COLORS.thumbColor}
                  ios_backgroundColor={COLORS["trackOffColor-light"]}
                />
              }
              padding="sm"
              showDivider={false}
            />
          </View>
        </View>

        {/* Language */}
        <View>
          <Text className="text-[14px] font-semibold text-textSecondary-light dark:text-textSecondary-dark mb-margin-md ml-margin-sm">
            {t("settings.language")}
          </Text>
          <View className="rounded-xl overflow-hidden">
            {renderLanguageOptions()}
          </View>
        </View>

        {/* About */}
        <View>
          <Text className="text-[14px] font-semibold text-textSecondary-light dark:text-textSecondary-dark mb-margin-md ml-margin-sm">
            {t("settings.about")}
          </Text>
          <View className="rounded-xl overflow-hidden">
            <SettingsItem
              title={t("settings.app_version")}
              rightElement={
                <Text className="text-[15px] text-textSecondary-light dark:text-textSecondary-dark">
                  {VERSION}
                </Text>
              }
            />
          </View>
        </View>
      </View>
    </Container>
  );
};

export default Settings;
