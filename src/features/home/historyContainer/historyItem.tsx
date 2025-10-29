import { Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { format } from "date-fns";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useTranslation } from "react-i18next";
import { HistoryRecord } from "@/interfaces";
import { COLORS } from "@/theme";
import { cn } from "@/utils";

type FontAwsome5Type = keyof typeof FontAwesome5.glyphMap;

export const HistoryItem = ({ record }: { record: HistoryRecord }) => {
  const { t } = useTranslation();
  const amount = Number(record.amount) || 0;
  const isExpense = record.type === "expense";
  const isGeneralCategory = record.category?.id === -1;
  const formattedAmount = isExpense
    ? `-${amount.toFixed(2)}€`
    : `+${amount.toFixed(2)}€`;

  const recordDate = record.date === "{}" ? new Date() : new Date(record.date);

  if (!record.type) {
    return (
      <View className="flex-row items-center w-full rounded-lg bg-containerBackground-light dark:bg-containerBackground-dark py-padding-sm">
        <CategoryIcon
          category={{
            icon: "exchange-alt",
            color: COLORS.darkGray,
          }}
        />
        <View className="ml-margin-md">
          <Text className="text-[12px] mb-margin-xs text-textPrimary-light dark:text-textPrimary-dark">
            {record.title}
          </Text>
          <View className="flex-row gap-1">
            <Text className="text-[10px] text-textSecondary-light dark:text-textSecondary-dark mt-margin-xs">
              {format(new Date(record.date), "MMM d")} |
            </Text>
            <Text
              className={cn(
                "text-[10px] text-textSecondary-light dark:text-textSecondary-dark mt-margin-xs",
                !record.fromAccount?.id && "line-through"
              )}
            >
              {record.fromAccount?.name}
            </Text>
            <Text className="text-[10px] text-textSecondary-light dark:text-textSecondary-dark mt-margin-xs">
              to
            </Text>
            <Text
              className={cn(
                "text-[10px] text-textSecondary-light dark:text-textSecondary-dark mt-margin-xs",
                !record.toAccount?.id && "line-through"
              )}
            >
              {record.toAccount?.name}
            </Text>
          </View>
        </View>
        <Text className="ml-auto text-[14px] font-semibold text-textPrimary-light dark:text-textPrimary-dark">
          {`${amount.toFixed(2)}€`}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center w-full rounded-lg bg-containerBackground-light dark:bg-containerBackground-dark py-padding-sm">
      <CategoryIcon
        category={
          isGeneralCategory
            ? { icon: "question", color: COLORS.gray }
            : record.category
            ? {
                icon: record.category?.icon as FontAwsome5Type,
                color: record.category?.color,
              }
            : { icon: "euro-sign", color: COLORS.green }
        }
      />

      <View className="ml-margin-md">
        <Text
          style={{
            fontSize: 12,
            marginBottom: 4,
            color: isGeneralCategory
              ? COLORS.gray
              : record.category?.color || COLORS.green,
          }}
        >
          {record.category?.name || t("transactions.income")}
        </Text>
        <Text className="text-[14px] font-medium text-textPrimary-light dark:text-textPrimary-dark">
          {record.title}
        </Text>
        <Text className="text-[10px] text-textSecondary-light dark:text-textSecondary-dark mt-margin-xs">
          {format(recordDate, "MMM d")} |{" "}
          <Text className={cn(!record.account?.id && "line-through")}>
            {record.account?.name}
          </Text>
        </Text>
      </View>

      <Text
        className={cn(
          "ml-auto text-[14px] font-semibold",
          isExpense ? "text-[14px] font-semibold" : "text-[14px] font-semibold"
        )}
        style={{ color: isExpense ? COLORS.red : COLORS.green }}
      >
        {formattedAmount}
      </Text>
    </View>
  );
};
