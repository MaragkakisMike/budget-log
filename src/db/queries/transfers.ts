import { and, desc, gte, lt } from "drizzle-orm";
import { transfers } from "@/db/schema";
import { DB } from "../client";

export const getTransfers = (
  drizzleDB: DB,
  startDate?: string,
  endDate?: string
) => {
  const query = drizzleDB.select().from(transfers);

  if (startDate && endDate) {
    query.where(
      and(gte(transfers.date, startDate), lt(transfers.date, endDate))
    );
  } else if (startDate) {
    query.where(gte(transfers.date, startDate));
  } else if (endDate) {
    query.where(lt(transfers.date, endDate));
  }

  query.orderBy(desc(transfers.date));

  return query;
};
