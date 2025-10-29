import React, { useMemo } from "react";
import { Text, Animated } from "react-native";
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

export const BottomSheet = ({ bottomSheetModalRef, title, ...props }) => {
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      // rounded top, themed background
      backgroundStyle={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      handleIndicatorStyle={{
        width: 40,
        height: 4,
        borderRadius: 2,
      }}
      backdropComponent={(backdropProps) => (
        <CustomBackdrop {...backdropProps} />
      )}
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
    () => [
      style,
      { backgroundColor: "rgba(0,0,0,0.5)" }, // same as original
    ],
    [style]
  );

  return <Animated.View style={containerStyle} />;
};
