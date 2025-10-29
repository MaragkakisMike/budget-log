import { useMemo } from "react";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import useDatabase from "./useDatabase";
import { getTransactions } from "@/db/queries/transactions";
import { getCategories } from "@/db/queries/categories";
import { getAccounts } from "@/db/queries/accounts";
import { getTransfers } from "@/db/queries/transfers";
import { getMonthRange, getYearRange } from "@/utils";

export const useTransactions = ({ year }: { year?: number } = {}) => {
  const drizzleDB = useDatabase();

  const { startDate, endDate } = year ? getYearRange(year) : getMonthRange();
  const { data: transactionsData } = useLiveQuery(
    getTransactions(drizzleDB, startDate, endDate),
    [startDate, endDate]
  );

  const { data: transfersData } = useLiveQuery(
    getTransfers(drizzleDB, startDate, endDate),
    [startDate, endDate]
  );
  const { data: categoriesData } = useLiveQuery(getCategories(drizzleDB));
  const { data: accountsData } = useLiveQuery(getAccounts(drizzleDB));

  const { categoryMap, accountMap } = useMemo(() => {
    if (!categoriesData || !accountsData) {
      return { categoryMap: {}, accountMap: {} };
    }

    const categoryMap = categoriesData.reduce((acc, category) => {
      acc[category.id] = category;
      return acc;
    }, {});

    const accountMap = accountsData.reduce((acc, account) => {
      acc[account.id] = account;
      return acc;
    }, {});

    return { categoryMap, accountMap };
  }, [categoriesData, accountsData]);

  const enrichedTransactions = useMemo(() => {
    if (!transactionsData || !categoriesData || !accountsData) return [];

    return transactionsData.map((transaction) => ({
      ...transaction,
      category:
        transaction.categoryId === -1
          ? { id: -1, name: "Uncategorized" }
          : categoryMap[transaction.categoryId],
      account: accountMap[transaction.accountId] || {
        id: null,
        name: transaction.accountName,
      },
    }));
  }, [transactionsData, categoryMap, accountMap, categoriesData, accountsData]);

  const enrichedTransfers = useMemo(() => {
    if (!transfersData || !accountsData) return [];

    return transfersData.map((transfer) => ({
      ...transfer,
      fromAccount: accountMap[transfer.fromAccountId] || {
        id: null,
        name: transfer.fromAccountName,
      },
      toAccount: accountMap[transfer.toAccountId] || {
        id: null,
        name: transfer.toAccountName,
      },
    }));
  }, [transfersData, accountMap, accountsData]);

  const isLoading = useMemo(() => {
    return (
      !transactionsData || !categoriesData || !accountsData || !transfersData
    );
  }, [transactionsData, categoriesData, accountsData, transfersData]);

  return {
    transactions: enrichedTransactions,
    transfers: enrichedTransfers,
    isLoading,
  };
};
