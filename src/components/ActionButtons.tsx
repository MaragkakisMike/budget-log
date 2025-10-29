// components/ActionButtons.tsx
import { FC } from "react";
import { View, ViewStyle } from "react-native";
import Button from "@/components/Button";

type ButtonConfig = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "outlineDanger";
  flex?: number; // optional
  disabled?: boolean;
};

interface ActionButtonsProps {
  buttons: ButtonConfig[];
  containerStyle?: ViewStyle;
  gap?: number;
}

export const ActionButtons: FC<ActionButtonsProps> = ({
  buttons,
  containerStyle,
  gap = 8,
}) => {
  return (
    <View
      className="flex-row w-full justify-between"
      style={[{ gap }, containerStyle]}
    >
      {buttons.map((btn, idx) => (
        <Button
          key={idx}
          title={btn.title}
          onPress={btn.onPress}
          variant={btn.variant || "primary"}
          disabled={btn.disabled}
          style={{ flex: btn.flex ?? 1 }}
        />
      ))}
    </View>
  );
};
