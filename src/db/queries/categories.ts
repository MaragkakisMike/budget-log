import { asc } from "drizzle-orm";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DB } from "@/db/client";

export const getCategories = (drizzleDb: DB) => {
  return drizzleDb.select().from(categories).orderBy(asc(categories.id));
};

export const getCategoryById = (drizzleDb: DB, id: number) => {
  return drizzleDb
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
};
