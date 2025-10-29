import { categories, transactions, type Category } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateTransaction } from "./transactions";

export const createCategory = async (
  drizzleDB,
  category: Omit<Category, "id">
) => {
  await drizzleDB.insert(categories).values(category);
};

export const updateCategory = async (
  drizzleDB,
  categoryId: number,
  category: Partial<Category>
) => {
  await drizzleDB
    .update(categories)
    .set(category)
    .where(eq(categories.id, categoryId));
};

export const deleteCategory = async (drizzleDB, category: Category) => {
  const categoryTransactions = await drizzleDB
    .select()
    .from(transactions)
    .where(eq(transactions.categoryId, category.id))
    .all();

  if (categoryTransactions.length > 0) {
    categoryTransactions.forEach((transaction) => {
      updateTransaction(drizzleDB, transaction.id, {
        ...transaction,
        categoryId: -1,
        categoryName: "",
      });
    });
  }

  await drizzleDB.delete(categories).where(eq(categories.id, category.id));
};
