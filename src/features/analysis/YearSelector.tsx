import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, TEXT_SIZES } from "@/theme";

type Props = {
  years: number[];
  selectedYear: number;
  handleYearSelection: (year: number) => void;
};

export const YearSelector: React.FC<Props> = ({
  years,
  selectedYear,
  handleYearSelection,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const currentIndex = years.indexOf(selectedYear);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < years.length - 1;

  const selectYear = (year: number) => {
    setModalVisible(false);
    handleYearSelection(year);
  };

  const handleYearTextClick = () => {
    if (years.length === 1) return;
    setModalVisible(true);
  };

  return (
    <View className="flex-row items-center justify-between my-2">
      {/* Left Arrow */}
      <TouchableOpacity
        disabled={!hasPrev}
        onPress={() => handleYearSelection(years[currentIndex - 1])}
        className="px-3"
      >
        <Ionicons
          name="chevron-back"
          size={24}
          color={hasPrev ? COLORS["textPrimary-light"] : COLORS["border-light"]}
        />
      </TouchableOpacity>

      {/* Year Text */}
      <TouchableOpacity onPress={handleYearTextClick}>
        <Text
          className="font-medium"
          style={{
            fontSize: parseInt(TEXT_SIZES["text-xl"]),
            paddingHorizontal: parseInt(SPACING["padding-default"]),
            color: COLORS["textPrimary-light"],
          }}
        >
          {selectedYear}
        </Text>
      </TouchableOpacity>

      {/* Right Arrow */}
      <TouchableOpacity
        disabled={!hasNext}
        onPress={() => handleYearSelection(years[currentIndex + 1])}
        className="px-3"
      >
        <Ionicons
          name="chevron-forward"
          size={24}
          color={hasNext ? COLORS["textPrimary-light"] : COLORS["border-light"]}
        />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-center bg-[rgba(0,0,0,0.3)]"
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View
            className="mx-10 rounded-lg"
            style={{
              backgroundColor: COLORS["containerBackground-light"],
              paddingVertical: parseInt(SPACING["padding-lg"]),
              elevation: 5,
            }}
          >
            <FlatList
              data={years}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`py-3 items-center ${
                    item === selectedYear ? "bg-secondary-light" : ""
                  }`}
                  onPress={() => selectYear(item)}
                >
                  <Text
                    className={item === selectedYear ? "font-bold" : ""}
                    style={{
                      fontSize: parseInt(TEXT_SIZES["text-lg"]),
                      color: COLORS["textPrimary-light"],
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default YearSelector;
