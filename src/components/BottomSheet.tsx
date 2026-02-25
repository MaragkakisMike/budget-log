import { useMemo } from "react";
import { Text, Animated, useColorScheme } from "react-native";
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { COLORS } from "@/theme";
import { useBottomSheet } from "@/contexts/bottomSheet.context";

interface BottomSheetProps {
  title: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export const BottomSheet = ({ title, ...props }: BottomSheetProps) => {
  const { ref, onSheetClose } = useBottomSheet();
  const colorScheme = useColorScheme();
  const backgroundColor =
    colorScheme === "dark"
      ? COLORS["containerBackground-dark"]
      : COLORS["containerBackground-light"];

  return (
    <BottomSheetModal
      ref={ref}
      onDismiss={onSheetClose}
      backgroundStyle={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor,
      }}
      handleIndicatorStyle={{
        width: 40,
        height: 4,
        borderRadius: 2,
      }}
      backdropComponent={(backdropProps) => (
        <CustomBackdrop {...backdropProps} />
      )}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      {...props}
    >
      <BottomSheetView className="px-padding-lg pb-padding-lg">
        <Text className="text-text-xl font-bold text-center mb-margin-lg text-textPrimary-light dark:text-textPrimary-dark">
          {title}
        </Text>
        {props.children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const CustomBackdrop = ({ style }: BottomSheetBackdropProps) => {
  const containerStyle = useMemo(
    () => [style, { backgroundColor: "rgba(0,0,0,0.5)" }],
    [style],
  );

  return <Animated.View style={containerStyle} />;
};
