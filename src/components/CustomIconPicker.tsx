import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { COLORS } from "@/theme";

const CustomIconPicker = ({
  showIconPicker = false,
  toggleIconPicker,
  icons = [],
  selectedIcon = "",
  onSelect,
  selectedIconColor = "#007AFF",
  iconSize = 32,
  disabled = false,
}) => {
  const { colorScheme } = useColorScheme();
  return (
    <>
      <TouchableOpacity
        onPress={disabled ? () => {} : toggleIconPicker}
        className="w-10 h-10 justify-center items-center rounded-full"
        style={{ backgroundColor: `${selectedIconColor}15` }}
      >
        <FontAwesome5
          name={selectedIcon}
          size={iconSize}
          color={selectedIconColor}
        />
      </TouchableOpacity>

      <Modal
        visible={showIconPicker}
        transparent
        animationType="fade"
        onRequestClose={toggleIconPicker}
      >
        <SafeAreaView className="flex-1">
          <View
            className="flex-1 justify-center items-center p-padding-lg"
            style={{ backgroundColor: COLORS[`modalShadow-${colorScheme}`] }}
          >
            <View
              className="w-[90%] max-h-[80%] rounded-2xl overflow-hidden"
              style={{
                backgroundColor: COLORS[`containerBackground-${colorScheme}`],
                shadowColor: "#fff",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <View
                className="flex-row justify-between items-center p-padding-default border-b border-[#EEEEEE]"
                style={{
                  backgroundColor: COLORS[`containerBackground-${colorScheme}`],
                }}
              >
                <Text className="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark">
                  Select Icon
                </Text>
                <TouchableOpacity
                  onPress={toggleIconPicker}
                  className="p-padding-sm"
                >
                  <MaterialIcons
                    name="close"
                    size={24}
                    color={COLORS[`textPrimary-${colorScheme}`]}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
              >
                <View className="p-padding-md">
                  <View className="flex-row flex-wrap justify-center items-start">
                    {icons.map((icon) => {
                      const isSelected = selectedIcon === icon;
                      return (
                        <TouchableOpacity
                          key={icon}
                          className="w-[50px] h-[50px] justify-center items-center m-margin-xs rounded-full"
                          style={{
                            backgroundColor: isSelected
                              ? `${selectedIconColor}15`
                              : "transparent",
                          }}
                          onPress={() => onSelect(icon)}
                          activeOpacity={0.7}
                        >
                          <View className="p-padding-sm rounded-lg">
                            <FontAwesome5
                              name={icon}
                              size={iconSize}
                              color={
                                isSelected
                                  ? selectedIconColor
                                  : COLORS[`textSecondary-${colorScheme}`]
                              }
                            />
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default CustomIconPicker;
