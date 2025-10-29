import CardContainer from "@/components/CardContainer";
import { Text, View, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import { deleteTransaction } from "@/db/mutations/transactions";
import useDatabase from "@/hooks/useDatabase";
import { useCallback } from "react";
import SwipeableItem from "@/components/SwipeableItem";
import { HistoryItem } from "./historyItem";
import { deleteTransfer } from "@/db/mutations/transfers";
import { ActionFormData } from "@/types/actions";
import { HistoryRecord } from "@/interfaces";
import useActionStore from "@/stores/actions-store";
import { useRouter } from "expo-router";
import { COLORS } from "@/theme";

const HistoryContainer = ({ transactions, transfers, selectedAction }) => {
  const { t } = useTranslation();
  const drizzleDB = useDatabase();
  const router = useRouter();
  const { setSelectedAction } = useActionStore();

  const handleDeleteTransaction = useCallback(
    (id) => {
      deleteTransaction(drizzleDB, id);
    },
    [drizzleDB]
  );

  const handleDeleteTransfer = useCallback(
    (transfer) => {
      deleteTransfer(drizzleDB, transfer);
    },
    [drizzleDB]
  );

  const handlePressTransaction = useCallback(
    (record: HistoryRecord) => {
      const actionData: ActionFormData = {
        id: record.id,
        type: record.type || "transfer",
        title: record.title,
        amount: record.amount.toString(),
        date: new Date(record.date),
        categoryId: record.categoryId,
        accountId: record.accountId,
        fromAccountId: record?.fromAccount?.id,
        toAccountId: record?.toAccount?.id,
      };

      const filteredData = Object.fromEntries(
        Object.entries(actionData).filter(
          ([, value]) => value !== null && value !== undefined
        )
      );
      setSelectedAction(filteredData as ActionFormData);
      router.navigate(`/action/${record.type || "transfer"}?isEdit=true`);
    },
    [router, setSelectedAction]
  );

  const filteredTransactions = transactions
    ? transactions.filter((record) =>
        selectedAction ? record.type === selectedAction : true
      )
    : [];

  return (
    <CardContainer title={t("navigation.history")}>
      {filteredTransactions.length > 0 && (
        <FlatList
          scrollEnabled={false}
          data={filteredTransactions}
          renderItem={({ item }) => (
            <SwipeableItem
              onRightSwipe={() => handleDeleteTransaction(item.id)}
              onPress={() => handlePressTransaction(item)}
            >
              <HistoryItem record={item} />
            </SwipeableItem>
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => (
            <View
              className="h-[1px] w-full"
              style={{ backgroundColor: COLORS.gray + "30" }}
            />
          )}
        />
      )}
      {!selectedAction &&
        !!filteredTransactions.length &&
        !!transfers.length && (
          <View
            className="h-[3px] w-full"
            style={{ backgroundColor: COLORS.gray + "30" }}
          />
        )}
      {!selectedAction && transfers.length > 0 && (
        <FlatList
          scrollEnabled={false}
          data={transfers}
          renderItem={({ item }) => (
            <SwipeableItem
              onRightSwipe={() => handleDeleteTransfer(item)}
              onPress={() => handlePressTransaction(item)}
            >
              <HistoryItem record={item} />
            </SwipeableItem>
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => (
            <View
              className="h-[1px] w-full"
              style={{ backgroundColor: COLORS.gray + "30" }}
            />
          )}
        />
      )}
      {!filteredTransactions.length && !transfers.length && (
        <Text className="text-center text-textSecondary-light dark:text-textSecondary-dark p-padding-lg">
          {t("general.noTransactions")}
        </Text>
      )}
    </CardContainer>
  );
};

export default HistoryContainer;
