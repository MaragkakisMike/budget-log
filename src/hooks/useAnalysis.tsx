import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import {
  getTotalValues,
  getTransfers,
  getBreakdownByCategory,
  processTransactionBreakdown,
  processTotalValues,
} from "@/db/queries/actions";
import { getAllTransactionYears } from "@/db/queries/transactions";
import { DB } from "@/db/client";
import { getMonthRange, getYearRange } from "@/utils";

// function getWeekRange(date: Date = new Date()) {
//   const dayOfWeek = date.getDay();
//   const startOfWeek = new Date(date);
//   startOfWeek.setDate(date.getDate() - dayOfWeek);
//   startOfWeek.setHours(0, 0, 0, 0);
//   const endOfWeek = new Date(startOfWeek);
//   endOfWeek.setDate(startOfWeek.getDate() + 6);
//   endOfWeek.setHours(23, 59, 59, 999);
//   return {
//     startDate: startOfWeek.toISOString(),
//     endDate: endOfWeek.toISOString(),
//   };
// }

// function getMonthRange(date: Date = new Date()) {
//   const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
//   firstDay.setHours(0, 0, 0, 0);
//   const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
//   lastDay.setHours(23, 59, 59, 999);
//   return {
//     startDate: firstDay.toISOString(),
//     endDate: lastDay.toISOString(),
//   };
// }

type TimePeriod = "week" | "month" | "year";

export const useAnalysis = (
  drizzleDB: DB,
  data: { year?: number; period?: TimePeriod; includeAllYears?: boolean }
) => {
  const { year, includeAllYears, period } = data;
  const { startDate, endDate } =
    period === "month" ? getMonthRange() : getYearRange(year);

  const totalsQuery = getTotalValues(drizzleDB, startDate, endDate);
  const transfersQuery = getTransfers(drizzleDB, startDate, endDate);
  const breakdownQuery = getBreakdownByCategory(drizzleDB, startDate, endDate);

  const { data: rawTotals } = useLiveQuery(totalsQuery, [startDate, endDate]);
  const { data: rawTransfers } = useLiveQuery(transfersQuery, [
    startDate,
    endDate,
  ]);
  const { data: rawBreakdown } = useLiveQuery(breakdownQuery, [
    startDate,
    endDate,
  ]);

  const yearsResult = useLiveQuery(getAllTransactionYears(drizzleDB), []);

  const analytics = processTotalValues(rawTotals || [], rawTransfers || []);
  const transactions = processTransactionBreakdown(rawBreakdown || []);

  let availableYears: Array<number> = [];
  if (includeAllYears && yearsResult.data) {
    availableYears = yearsResult.data
      .map((transaction) => new Date(transaction.date).getFullYear())
      .filter((year, index, self) => self.indexOf(year) === index)
      .sort((a, b) => a - b);
  }

  return {
    analytics,
    transactions,
    availableYears,
  };
};

export const useThisWeekAnalysis = (drizzleDB: DB) => {
  return useAnalysis(drizzleDB, { period: "week" });
};

export const useThisMonthAnalysis = (drizzleDB: DB) => {
  return useAnalysis(drizzleDB, { period: "month" });
};

export const useThisYearAnalysis = (drizzleDB: DB) => {
  return useAnalysis(drizzleDB, { period: "year" });
};
