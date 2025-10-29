import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

const useDatabase = () => {
  const db = useSQLiteContext();
  const drizzleDB = drizzle(db);
  return drizzleDB;
};

export default useDatabase;
