import { accounts, type Account } from "@/db/schema";
import { eq } from "drizzle-orm";

export const createAccount = async (
  drizzleDB,
  account: Omit<Account, "id">
) => {
  await drizzleDB.insert(accounts).values(account);
};

export const updateAccount = async (
  drizzleDB,
  accountId: number,
  account: Partial<Account>
) => {
  await drizzleDB
    .update(accounts)
    .set(account)
    .where(eq(accounts.id, accountId));
};

export const deleteAccount = async (drizzleDB, accountId: number) => {
  await drizzleDB.delete(accounts).where(eq(accounts.id, accountId));
};
