import CardContainer from "@/components/CardContainer";
import { View, Text, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import useDatabase from "@/hooks/useDatabase";
import { useRef, useState, useEffect } from "react";
import { useThisMonthAnalysis } from "@/hooks/useAnalysis";
import { COLORS } from "@/theme";

interface FinancialItemProps {
  type: "income" | "expense";
  amount: number;
  isSelected: boolean;
  onPress: () => void;
}

const FinancialItem = ({
  type,
  amount,
  isSelected,
  onPress,
}: FinancialItemProps) => {
  const { t } = useTranslation();

  const leftIndicatorWidth = useRef(new Animated.Value(0)).current;
  const rightIndicatorWidth = useRef(new Animated.Value(0)).current;
  const indicatorOpacity = useRef(new Animated.Value(0)).current;

  const isIncome = type === "income";
  const color = isIncome ? COLORS["green"] : COLORS["red"];
  const iconName = isIncome ? "trending-up" : "trending-down";
  const label = t(isIncome ? "transactions.income" : "transactions.expenses");

  useEffect(() => {
    if (isSelected) {
      // Animate from center to edges
      Animated.parallel([
        Animated.timing(leftIndicatorWidth, {
          toValue: 50, // 50% width
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(rightIndicatorWidth, {
          toValue: 50, // 50% width
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(indicatorOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Animate back to center (0 width)
      Animated.parallel([
        Animated.timing(leftIndicatorWidth, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(rightIndicatorWidth, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(indicatorOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isSelected, leftIndicatorWidth, rightIndicatorWidth, indicatorOpacity]);

  const leftIndicatorWidthValue = leftIndicatorWidth.interpolate({
    inputRange: [0, 50],
    outputRange: ["0%", "50%"],
  });

  const rightIndicatorWidthValue = rightIndicatorWidth.interpolate({
    inputRange: [0, 50],
    outputRange: ["0%", "50%"],
  });

  return (
    <Pressable
      className="flex-row items-center flex-1 relative"
      onPress={onPress}
    >
      <View
        className={`w-12 h-12 rounded-full justify-center items-center mr-margin-md border-2 ${
          isIncome ? "border-green bg-green/10" : "border-red bg-red/10"
        }`}
      >
        <Ionicons name={iconName} size={24} color={color} />
      </View>
      <View>
        <Text className="text-text-sm mb-margin-xs text-textPrimary-light dark:text-textPrimary-dark">
          {label}
        </Text>
        <Text
          className={`text-text-lg font-semibold ${
            isIncome ? "text-green" : "text-red"
          }`}
        >
          €{amount}
        </Text>
      </View>

      <View className="absolute bottom-[-10px] left-0 right-0 flex-row justify-center">
        <Animated.View
          className="h-[2px] rounded-sm absolute right-[50%]"
          style={{
            width: leftIndicatorWidthValue,
            backgroundColor: color,
            opacity: indicatorOpacity,
          }}
        />
        <Animated.View
          className="h-[2px] rounded-sm absolute left-[50%]"
          style={{
            width: rightIndicatorWidthValue,
            backgroundColor: color,
            opacity: indicatorOpacity,
          }}
        />
      </View>
    </Pressable>
  );
};

const IncomeExpensesContainer = ({ onSelectAction }) => {
  const drizzleDB = useDatabase();
  const [selectedAction, setSelectedAction] = useState<"income" | "expense">();
  const { analytics } = useThisMonthAnalysis(drizzleDB);
  const { totalIncome, totalExpense } = analytics;

  const handleSelectAction = (action: "income" | "expense") => {
    const isDeselecting = selectedAction === action;
    const newSelection = isDeselecting ? undefined : action;

    setSelectedAction(newSelection);
    onSelectAction(newSelection ? action : null);
  };

  return (
    <CardContainer>
      <View className="flex-row justify-between gap-gap-default">
        <FinancialItem
          type="income"
          amount={totalIncome}
          isSelected={selectedAction === "income"}
          onPress={() => handleSelectAction("income")}
        />

        <FinancialItem
          type="expense"
          amount={totalExpense}
          isSelected={selectedAction === "expense"}
          onPress={() => handleSelectAction("expense")}
        />
      </View>
    </CardContainer>
  );
};

export default IncomeExpensesContainer;
