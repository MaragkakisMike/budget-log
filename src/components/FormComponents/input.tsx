import { View, Text, TextInput, TextInputProps } from "react-native";
import {
  Controller,
  Control,
  FieldValues,
  Path,
  FieldError,
} from "react-hook-form";

import { cn } from "@/utils";
import { formClasses } from "./formClasses";

interface FormTextInputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: object;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
}

export function FormTextInput<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  error,
  placeholder,
  disabled = false,
  ...rest
}: FormTextInputProps<T>) {
  return (
    <View className={formClasses.inputContainer}>
      <Text className={formClasses.inputLabel}>{label}</Text>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={cn(formClasses.input, error && formClasses.inputError)}
            value={value}
            editable={!disabled}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            {...rest}
          />
        )}
      />

      {error && <Text className={formClasses.errorText}>{error.message}</Text>}
    </View>
  );
}

export default FormTextInput;
