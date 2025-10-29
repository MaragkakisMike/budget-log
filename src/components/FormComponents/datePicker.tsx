import { View, Text, Pressable, Platform } from "react-native";
import {
  Controller,
  Control,
  FieldValues,
  Path,
  FieldError,
} from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { formClasses } from "./formClasses";

interface FormDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: object;
  error?: FieldError;
  disabled?: boolean;
}

export function FormDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  error,
  disabled = false,
}: FormDatePickerProps<T>) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View className={formClasses.inputContainer}>
      <Text className={formClasses.inputLabel}>{label}</Text>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <>
            <Pressable
              disabled={disabled}
              className={formClasses.datePickerButton}
              onPress={() => setShowPicker(true)}
            >
              <Text className={formClasses.dateText}>
                {value ? new Date(value).toLocaleDateString("en-GB") : label}
              </Text>
            </Pressable>

            {showPicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowPicker(Platform.OS === "ios"); // iOS stays open until dismissed
                  if (selectedDate) {
                    onChange(selectedDate);
                  }
                }}
              />
            )}
          </>
        )}
      />

      {error && <Text className={formClasses.errorText}>{error.message}</Text>}
    </View>
  );
}

export default FormDatePicker;
