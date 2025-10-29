import {
  ExpenseFormData,
  IncomeFormData,
  TransferFormData,
} from "@/interfaces";

export type ActionFormData =
  | ExpenseFormData
  | IncomeFormData
  | TransferFormData;

export type ActionType = "expense" | "income" | "transfer";

export type TotalValues = {
  totalIncome: number;
  totalExpense: number;
};
