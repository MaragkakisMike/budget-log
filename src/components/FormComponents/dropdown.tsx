import { View, Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import {
  Controller,
  Control,
  FieldValues,
  Path,
  FieldError,
} from "react-hook-form";

import { formClasses } from "./formClasses";

interface FormDropdownSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  items: { label: string; value: string | number }[];
  rules?: object;
  error?: FieldError;
  placeholder?: string;
}

export function FormDropdownSelect<T extends FieldValues>({
  control,
  name,
  label,
  items,
  rules,
  error,
  placeholder,
}: FormDropdownSelectProps<T>) {
  return (
    <View className={formClasses.inputContainer}>
      <Text className={formClasses.inputLabel}>{label}</Text>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <View className={formClasses.dropdownContainer}>
            <RNPickerSelect
              onValueChange={onChange}
              items={items}
              value={value}
              placeholder={{ label: placeholder || "", value: null }}
            />
          </View>
        )}
      />

      {error && <Text className={formClasses.errorText}>{error.message}</Text>}
    </View>
  );
}

export default FormDropdownSelect;
