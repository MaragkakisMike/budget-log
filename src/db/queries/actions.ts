import { sql } from "drizzle-orm";
import { eq, and, gte, lt, desc } from "drizzle-orm";
import { transactions, categories, transfers } from "@/db/schema";
import { DB } from "@/db/client";

export const getTotalValues = (
  drizzleDB: DB,
  startDate?: string,
  endDate?: string
) => {
  const query = drizzleDB
    .select({
      totalIncome:
        sql<number>`SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END)`.mapWith(
          Number
        ),
      totalExpense:
        sql<number>`SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)`.mapWith(
          Number
        ),
    })
    .from(transactions);

  if (startDate && endDate) {
    query.where(
      and(gte(transactions.date, startDate), lt(transactions.date, endDate))
    );
  } else if (startDate) {
    query.where(gte(transactions.date, startDate));
  } else if (endDate) {
    query.where(lt(transactions.date, endDate));
  }

  return query;
};

export const getTransfers = (
  drizzleDB: DB,
  startDate?: string,
  endDate?: string
) => {
  const query = drizzleDB
    .select({
      totalTransfer: sql<number>`SUM(amount)`.mapWith(Number),
    })
    .from(transfers);

  if (startDate && endDate) {
    query.where(
      and(gte(transfers.date, startDate), lt(transfers.date, endDate))
    );
  } else if (startDate) {
    query.where(gte(transfers.date, startDate));
  } else if (endDate) {
    query.where(lt(transfers.date, endDate));
  }

  return query;
};

export const getBreakdownByCategory = (
  drizzleDB: DB,
  startDate?: string,
  endDate?: string
) => {
  const query = drizzleDB
    .select({
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      totalAmount: sql<number>`SUM(amount)`.mapWith(Number),
      type: transactions.type,
      color: categories.color,
      icon: categories.icon,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id));

  if (startDate && endDate) {
    query.where(
      and(gte(transactions.date, startDate), lt(transactions.date, endDate))
    );
  } else if (startDate) {
    query.where(gte(transactions.date, startDate));
  } else if (endDate) {
    query.where(lt(transactions.date, endDate));
  }

  return query.groupBy(
    transactions.categoryId,
    categories.name,
    transactions.type,
    categories.color,
    categories.icon
  );
};

export const getExpensesByCategory = (
  drizzleDB: DB,
  categoryId: number,
  startDate?: string,
  endDate?: string
) => {
  const query = drizzleDB
    .select({
      id: transactions.id,
      amount: transactions.amount,
      date: transactions.date,
      type: transactions.type,
      title: transactions.title,
      accountId: transactions.accountId,
      accountName: transactions.accountName,
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      categoryColor: categories.color,
      categoryIcon: categories.icon,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id));

  const conditions = [
    eq(transactions.categoryId, categoryId),
    eq(transactions.type, "expense"),
  ];

  if (startDate && endDate) {
    conditions.push(
      gte(transactions.date, startDate),
      lt(transactions.date, endDate)
    );
  } else if (startDate) {
    conditions.push(gte(transactions.date, startDate));
  } else if (endDate) {
    conditions.push(lt(transactions.date, endDate));
  }

  return query.where(and(...conditions)).orderBy(desc(transactions.date));
};

export const getTransactions = (drizzleDB: DB) => {
  return drizzleDB.select().from(transactions).orderBy(desc(transactions.date));
};

export const processTransactionBreakdown = (transactions: any[]) => {
  if (!transactions || transactions.length === 0) {
    return {
      incomeTransactions: [],
      expenseTransactions: [],
    };
  }

  const incomeTransactions = transactions.filter((t) => t.type === "income");
  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  const totalIncomeAmount = incomeTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const totalExpenseAmount = expenseTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  const incomeTransactionsWithPercentage = incomeTransactions.map(
    (transaction) => ({
      ...transaction,
      percentage:
        totalIncomeAmount > 0
          ? Math.round((transaction.amount / totalIncomeAmount) * 100)
          : 0,
    })
  );

  const expenseTransactionsWithPercentage = expenseTransactions.map(
    (transaction) => ({
      ...transaction,
      percentage:
        totalExpenseAmount > 0
          ? Math.round((transaction.amount / totalExpenseAmount) * 100)
          : 0,
    })
  );

  return {
    incomeTransactions: incomeTransactionsWithPercentage,
    expenseTransactions: expenseTransactionsWithPercentage,
  };
};

export const processTotalValues = (totalsData: any[], transfersData: any[]) => {
  const totals = totalsData?.[0] || {};
  const transfers = transfersData?.[0] || {};

  return {
    totalIncome: totals.totalIncome || 0,
    totalExpense: totals.totalExpense || 0,
    totalTransfer: transfers.totalTransfer || 0,
  };
};
