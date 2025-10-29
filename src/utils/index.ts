import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return date.toLocaleDateString();
}

export function getYearRange(year?: number) {
  if (!year) {
    year = new Date().getFullYear();
  }
  const firstDay = new Date(year, 0, 1);
  firstDay.setHours(0, 0, 0, 0);
  const lastDay = new Date(year, 11, 31);
  lastDay.setHours(23, 59, 59, 999);
  return {
    startDate: firstDay.toISOString(),
    endDate: lastDay.toISOString(),
  };
}
export function getMonthRange(year?: number, month?: number) {
  const now = new Date();

  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth();

  const firstDay = new Date(y, m, 1);
  firstDay.setHours(0, 0, 0, 0);

  const lastDay = new Date(y, m + 1, 0);
  lastDay.setHours(23, 59, 59, 999);

  return {
    startDate: firstDay.toISOString(),
    endDate: lastDay.toISOString(),
  };
}
