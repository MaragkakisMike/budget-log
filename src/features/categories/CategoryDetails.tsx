import { View, TextInput, Text } from "react-native";
import { BottomSheet } from "@/components/BottomSheet";
import { FC, useState, useCallback, useEffect, MutableRefObject } from "react";
import CustomIconPicker from "@/components/CustomIconPicker";
import ColorPicker from "react-native-wheel-color-picker";
import useDatabase from "@/hooks/useDatabase";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/db/mutations/categories";
import { useCategories } from "@/contexts/categories/categories-context";
import { categoryIcons } from "@/constants";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { useColorScheme } from "nativewind";
import { COLORS } from "@/theme";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ActionButtons } from "@/components/ActionButtons";

export const CategoryDetails: FC<{
  categoryBottomSheetRef: MutableRefObject<BottomSheetModal>;
}> = ({ categoryBottomSheetRef }) => {
  const { colorScheme } = useColorScheme();
  const drizzleDB = useDatabase();
  const { selectedCategory, setSelectedCategory } = useCategories();
  const { t } = useTranslation();

  const getRandomColor = () => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E2",
      "#F8B739",
      "#52B788",
      "#FF8FAB",
      "#6C5CE7",
      "#00B894",
      "#FDCB6E",
      "#E17055",
      "#74B9FF",
      "#A29BFE",
      "#FD79A8",
      "#FFEAA7",
      "#55EFC4",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const isViewMode = !!selectedCategory;
  const [isEditing, setIsEditing] = useState(!!selectedCategory);
  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: categoryIcons[Math.floor(Math.random() * categoryIcons.length)],
    color: getRandomColor(),
  });
  const [isIconModalVisible, setIsIconModalVisible] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      setNewCategory(selectedCategory);
      setIsEditing(false);
    } else {
      setNewCategory({
        name: "",
        icon: categoryIcons[Math.floor(Math.random() * categoryIcons.length)],
        color: getRandomColor(),
      });
      setIsEditing(true);
    }
  }, [selectedCategory]);

  const handleColorChange = useCallback((color: string) => {
    requestAnimationFrame(() => {
      setNewCategory((prev) => ({ ...prev, color }));
    });
  }, []);

  const handleIconSelect = useCallback((icon) => {
    setNewCategory((prev) => ({ ...prev, icon }));
    setIsIconModalVisible(false);
  }, []);

  const toggleIconPicker = useCallback(() => {
    setIsIconModalVisible((prev) => !prev);
  }, []);

  const handleSubmit = () => {
    if (!newCategory.name.trim()) return;

    if (isViewMode && selectedCategory) {
      const changes = Object.keys(newCategory).reduce((acc, key) => {
        if (newCategory[key] !== selectedCategory[key]) {
          acc[key] = newCategory[key];
        }
        return acc;
      }, {});

      if (Object.keys(changes).length) {
        updateCategory(drizzleDB, selectedCategory.id, changes);
      }
    } else {
      createCategory(drizzleDB, newCategory);
    }

    setIsEditing(false);
    categoryBottomSheetRef.current?.dismiss();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = useCallback(() => {
    if (selectedCategory) {
      deleteCategory(drizzleDB, selectedCategory);
      categoryBottomSheetRef.current?.dismiss();
    }
  }, [drizzleDB, selectedCategory, categoryBottomSheetRef]);

  const handleCancel = () => {
    if (selectedCategory) {
      setNewCategory(selectedCategory);
      setIsEditing(false);
    } else {
      categoryBottomSheetRef.current?.dismiss();
    }
  };

  const handleDismiss = () => {
    setSelectedCategory(null);
  };

  return (
    <BottomSheet
      bottomSheetModalRef={categoryBottomSheetRef}
      title={
        isViewMode
          ? isEditing
            ? t("categories.edit_category")
            : t("categories.category_details")
          : t("categories.new_category")
      }
      onDismiss={handleDismiss}
    >
      <View className="w-full items-center gap-gap-lg">
        <View className="w-full items-start">
          <Text className="text-text-xs text-textSecondary-light dark:text-textSecondary-dark mb-1 ml-1">
            {t("categories.tap_to_select_icon")}
          </Text>
          <View className="flex-row w-full items-center justify-center gap-gap-default">
            <CustomIconPicker
              showIconPicker={isIconModalVisible}
              toggleIconPicker={toggleIconPicker}
              icons={categoryIcons}
              selectedIcon={newCategory.icon}
              onSelect={handleIconSelect}
              selectedIconColor={newCategory.color}
              iconSize={24}
              disabled={!isEditing}
            />
            <TextInput
              placeholder={t("categories.category_name")}
              placeholderTextColor={COLORS[`textSecondary-${colorScheme}`]}
              value={newCategory.name}
              onChangeText={(name) =>
                setNewCategory((prev) => ({ ...prev, name }))
              }
              editable={isEditing}
              className={cn(
                "flex-1 text-text-md text-textPrimary-light dark:text-textPrimary-dark",
                "border-b border-textPrimary-light dark:border-textPrimary-dark"
              )}
            />
          </View>
        </View>

        <View className="flex-row w-4/5 h-[280px]">
          <ColorPicker
            color={newCategory.color}
            onColorChange={handleColorChange}
            thumbSize={40}
            noSnap={true}
            row={false}
            useNativeDriver={true}
            useNativeLayout={true}
            swatches={false}
            discrete={true}
            sliderSize={40}
            gapSize={0}
            discreteLength={10}
            disabled={!isEditing}
          />
        </View>

        <View className="mt-margin-lg w-full">
          {!isEditing && isViewMode ? (
            <ActionButtons
              buttons={[
                {
                  title: t("actions.delete"),
                  onPress: handleDelete,
                  variant: "outlineDanger",
                },
                {
                  title: t("actions.edit"),
                  onPress: handleEdit,
                  variant: "primary",
                },
              ]}
            />
          ) : (
            <ActionButtons
              buttons={[
                {
                  title: t("actions.cancel"),
                  onPress: handleCancel,
                  variant: "outline",
                },
                {
                  title: t("actions.save"),
                  onPress: handleSubmit,
                  variant: "primary",
                },
              ]}
            />
          )}
        </View>
      </View>
    </BottomSheet>
  );
};

export default CategoryDetails;
