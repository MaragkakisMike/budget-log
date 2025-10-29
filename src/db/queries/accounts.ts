import { asc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { accounts } from "@/db/schema";
import { DB } from "@/db/client";

export const getAccounts = (drizzleDb: DB) => {
  return drizzleDb.select().from(accounts).orderBy(asc(accounts.id));
};

export const getAccountById = (drizzleDb: DB, id: number) => {
  return drizzleDb.select().from(accounts).where(eq(accounts.id, id)).limit(1);
};
