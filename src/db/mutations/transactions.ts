import { eq } from "drizzle-orm";
import { transactions, type Transaction, accounts } from "@/db/schema";

export const createTransaction = async (
  drizzleDB,
  transaction: Omit<Transaction, "id">
) => {
  const insertedTransaction = await drizzleDB
    .insert(transactions)
    .values(transaction)
    .returning({ id: transactions.id });

  const account = await drizzleDB
    .select()
    .from(accounts)
    .where(eq(accounts.id, transaction.accountId))
    .get();

  if (!account) {
    throw new Error(`Account with ID ${transaction.accountId} not found`);
  }

  const newBalance =
    transaction.type === "income"
      ? account.balance + Number(transaction.amount)
      : account.balance - Number(transaction.amount);

  await drizzleDB
    .update(accounts)
    .set({ balance: newBalance })
    .where(eq(accounts.id, transaction.accountId));

  return insertedTransaction[0];
};

export const deleteTransaction = async (drizzleDB, transactionId: number) => {
  const transaction = await drizzleDB
    .select()
    .from(transactions)
    .where(eq(transactions.id, transactionId))
    .get();

  if (!transaction) {
    throw new Error(`Transaction with ID ${transactionId} not found`);
  }

  const account = await drizzleDB
    .select()
    .from(accounts)
    .where(eq(accounts.id, transaction.accountId))
    .get();

  if (account) {
    const newBalance =
      transaction.type === "income"
        ? account.balance - transaction.amount
        : account.balance + transaction.amount;

    await drizzleDB
      .update(accounts)
      .set({ balance: newBalance })
      .where(eq(accounts.id, transaction.accountId));
  }
  await drizzleDB
    .delete(transactions)
    .where(eq(transactions.id, transactionId));
};

export const updateTransaction = async (
  drizzleDB,
  transactionId: number,
  updatedTransaction: Partial<Transaction>
) => {
  const originalTransaction = await drizzleDB
    .select()
    .from(transactions)
    .where(eq(transactions.id, transactionId))
    .get();

  if (!originalTransaction) {
    throw new Error(`Transaction with ID ${transactionId} not found`);
  }

  const currentAccount = await drizzleDB
    .select()
    .from(accounts)
    .where(eq(accounts.id, originalTransaction.accountId))
    .get();

  if (!currentAccount) {
    throw new Error(
      `Account with ID ${originalTransaction.accountId} not found`
    );
  }

  const balanceAfterRevert =
    originalTransaction.type === "income"
      ? currentAccount.balance - originalTransaction.amount
      : currentAccount.balance + originalTransaction.amount;

  const finalTransaction = {
    ...originalTransaction,
    ...updatedTransaction,
  };

  if (
    updatedTransaction.accountId &&
    updatedTransaction.accountId !== originalTransaction.accountId
  ) {
    await drizzleDB
      .update(accounts)
      .set({ balance: balanceAfterRevert })
      .where(eq(accounts.id, originalTransaction.accountId));

    const newAccount = await drizzleDB
      .select()
      .from(accounts)
      .where(eq(accounts.id, updatedTransaction.accountId))
      .get();

    if (!newAccount) {
      throw new Error(
        `New account with ID ${updatedTransaction.accountId} not found`
      );
    }

    const newAccountBalance =
      finalTransaction.type === "income"
        ? newAccount.balance + Number(finalTransaction.amount)
        : newAccount.balance - Number(finalTransaction.amount);

    await drizzleDB
      .update(accounts)
      .set({ balance: newAccountBalance })
      .where(eq(accounts.id, updatedTransaction.accountId));
  } else {
    const newBalance =
      finalTransaction.type === "income"
        ? balanceAfterRevert + Number(finalTransaction.amount)
        : balanceAfterRevert - Number(finalTransaction.amount);

    await drizzleDB
      .update(accounts)
      .set({ balance: newBalance })
      .where(eq(accounts.id, originalTransaction.accountId));
  }

  const updatedRecord = await drizzleDB
    .update(transactions)
    .set(updatedTransaction)
    .where(eq(transactions.id, transactionId))
    .returning();

  return updatedRecord[0];
};
