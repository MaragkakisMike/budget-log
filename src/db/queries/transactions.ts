import { and, desc, gte, lt } from "drizzle-orm";
import { transactions } from "@/db/schema";
import { DB } from "@/db/client";

export const getTransactions = (
  drizzleDB: DB,
  startDate?: string,
  endDate?: string
) => {
  const query = drizzleDB.select().from(transactions);

  if (startDate && endDate) {
    query.where(
      and(gte(transactions.date, startDate), lt(transactions.date, endDate))
    );
  } else if (startDate) {
    query.where(gte(transactions.date, startDate));
  } else if (endDate) {
    query.where(lt(transactions.date, endDate));
  }

  query.orderBy(desc(transactions.date));

  return query;
};
export const getAllTransactionYears = (drizzleDB: DB) => {
  return drizzleDB
    .select({
      date: transactions.date,
    })
    .from(transactions)
    .orderBy(desc(transactions.date));
};
