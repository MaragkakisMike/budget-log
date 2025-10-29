import { COLORS } from "@/theme";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SafePageViewProps = {
  children: React.ReactNode;
  style?: object;
  colorScheme?: "light" | "dark";
} & React.ComponentProps<typeof View>;

export default function SafePageView({
  children,
  style,
  colorScheme,
  ...rest
}: SafePageViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 "
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        ...style,
      }}
      {...rest}
    >
      <StatusBar
        style={"auto"}
        backgroundColor={
          COLORS[`containerBackground-${colorScheme || "light"}`]
        }
      />

      {children}
    </View>
  );
}
