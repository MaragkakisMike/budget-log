import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const accounts = sqliteTable("accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  balance: real("balance").notNull().default(0),
});

export type Account = typeof accounts.$inferSelect;

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
});

export type Category = typeof categories.$inferSelect;

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  amount: real("amount").notNull(),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "cascade",
  }),
  categoryName: text("category_name"),
  accountId: integer("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  accountName: text("account_name").notNull(),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  date: text("date").notNull(),
});

export type Transaction = typeof transactions.$inferSelect;

export const transfers = sqliteTable("transfers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  amount: real("amount").notNull(),
  fromAccountId: integer("from_account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  fromAccountName: text("from_account_name").notNull(),
  toAccountId: integer("to_account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  toAccountName: text("to_account_name").notNull(),
  date: text("date").notNull(),
});

export type Transfer = typeof transfers.$inferSelect;
