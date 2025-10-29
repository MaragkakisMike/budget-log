import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import {
  Controller,
  Control,
  FieldValues,
  Path,
  FieldError,
} from "react-hook-form";
import { cn } from "@/utils";
import { formClasses } from "./formClasses";

type ChipItem = {
  label: string;
  value: number;
  color: string;
  disabled?: boolean;
};

interface FormChipSelectorProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  chips: ChipItem[];
  rules?: object;
  error?: FieldError;
  containerStyle?: ViewStyle;
  disabled?: boolean;
  multiple?: boolean;
  onSelect?: (value: number) => void;
}

export function FormChipSelector<T extends FieldValues>({
  control,
  name,
  label,
  chips,
  rules,
  error,
  containerStyle,
  disabled = false,
  multiple = false,
  onSelect,
}: FormChipSelectorProps<T>) {
  const handleChipSelect = (
    chipValue: number,
    currentValue: number | number[],
    onChange: (value: number | number[]) => void
  ) => {
    if (multiple) {
      const selectedChips = Array.isArray(currentValue) ? currentValue : [];

      if (selectedChips.includes(chipValue)) {
        onChange(selectedChips.filter((value) => value !== chipValue));
      } else {
        onChange([...selectedChips, chipValue]);
      }
    } else {
      if (currentValue === chipValue) {
        onChange(null);
      } else {
        onChange(chipValue);
      }
      onSelect?.(chipValue);
    }
  };

  const isChipSelected = (
    chipValue: number,
    currentValue: number | number[]
  ) => {
    if (multiple) {
      return Array.isArray(currentValue) && currentValue.includes(chipValue);
    } else {
      return currentValue === chipValue;
    }
  };

  return (
    <View className={formClasses.inputContainer} style={containerStyle}>
      <Text className={formClasses.inputLabel}>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <View className={formClasses.chipsContainer}>
            {chips.map((chip) => {
              const isSelected = isChipSelected(chip.value, value);
              const isChipDisabled = disabled || chip.disabled;

              return (
                <TouchableOpacity
                  key={chip.value}
                  onPress={() =>
                    !isChipDisabled &&
                    handleChipSelect(chip.value, value, onChange)
                  }
                  disabled={isChipDisabled}
                  className={formClasses.chip}
                  style={{
                    backgroundColor: isSelected ? chip.color : "transparent",
                    borderWidth: 2,
                    borderColor: chip.color,
                    opacity: isChipDisabled ? 0.5 : 1,
                  }}
                >
                  <Text
                    className={cn(
                      formClasses.chipText,
                      isSelected
                        ? "text-white"
                        : "text-textPrimary-light dark:text-textPrimary-dark"
                    )}
                  >
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />
      {error && <Text className={formClasses.errorText}>{error.message}</Text>}
    </View>
  );
}

export default FormChipSelector;
