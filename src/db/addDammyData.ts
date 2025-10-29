import { accounts } from "@/db/schema";
import AsyncStorage from "expo-sqlite/kv-store";
import { db } from "@/db/client";
export const addDammyData = async () => {
  const value = AsyncStorage.getItemSync("dbInitialized");
  if (value) {
    return;
  }
  await db.insert(accounts).values([
    { name: "Euro", balance: 100 },
    { name: "Dollar", balance: 200 },
  ]);

  AsyncStorage.setItemSync("dbInitialized", "true");
};
