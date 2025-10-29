import { Category, Account } from "@/db/schema";

interface BaseFormData {
  id?: number;
  amount: string;
  title: string;
  date: string | Date;
}

export interface HistoryRecord extends BaseFormData {
  type: "expense" | "income";
  category: Category;
  account: Account;
  accountId?: number;
  categoryId?: number;
  fromAccount?: Account;
  toAccount?: Account;
}

export interface ExpenseFormData extends BaseFormData {
  type: "expense";
  categoryId: number | null;
  accountId: number | null;
}

export interface IncomeFormData extends BaseFormData {
  type: "income";
  accountId: number | null;
}

export interface TransferFormData extends BaseFormData {
  type: "transfer";
  fromAccountId: number | null;
  toAccountId: number | null;
}
export interface Chip {
  label: string;
  value: string | number;
  color?: string;
}

export interface CategoryRecord {
  categoryId: number;
  categoryName: string;
  color: string;
  totalAmount: number;
  type: string;
  icon: string;
  percentage?: number;
}
