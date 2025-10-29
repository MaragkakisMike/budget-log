import { eq } from "drizzle-orm";
import { Transfer } from "../schema";
import { transfers, accounts } from "../schema";

export const createTransfer = async (
  drizzleDB,
  transfer: Omit<Transfer, "id">
) => {
  const insertedTransfer = await drizzleDB
    .insert(transfers)
    .values(transfer)
    .returning({ id: transfers.id });

  const fromAccount = await drizzleDB
    .select()
    .from(accounts)
    .where(eq(accounts.id, transfer.fromAccountId))
    .get();

  if (!fromAccount) {
    throw new Error(`From Account with ID ${transfer.fromAccountId} not found`);
  }

  const toAccount = await drizzleDB
    .select()
    .from(accounts)
    .where(eq(accounts.id, transfer.toAccountId))
    .get();

  if (!toAccount) {
    throw new Error(`To Account with ID ${transfer.toAccountId} not found`);
  }

  const newFromBalance = fromAccount.balance - Number(transfer.amount);
  const newToBalance = toAccount.balance + Number(transfer.amount);

  await drizzleDB
    .update(accounts)
    .set({ balance: newFromBalance })
    .where(eq(accounts.id, transfer.fromAccountId));

  await drizzleDB
    .update(accounts)
    .set({ balance: newToBalance })
    .where(eq(accounts.id, transfer.toAccountId));

  return insertedTransfer[0];
};

export const deleteTransfer = async (drizzleDB, transfer: Transfer) => {
  const fromAccount = await drizzleDB
    .select()
    .from(accounts)
    .where(eq(accounts.id, transfer.fromAccountId))
    .get();

  const toAccount = await drizzleDB
    .select()
    .from(accounts)
    .where(eq(accounts.id, transfer.toAccountId))
    .get();

  if (fromAccount) {
    const newFromBalance =
      (fromAccount?.balance || 0) + Number(transfer.amount);
    await drizzleDB
      .update(accounts)
      .set({ balance: newFromBalance })
      .where(eq(accounts.id, transfer.fromAccountId));
  }
  if (toAccount) {
    const newToBalance = (toAccount?.balance || 0) - Number(transfer.amount);
    await drizzleDB
      .update(accounts)
      .set({ balance: newToBalance })
      .where(eq(accounts.id, transfer.toAccountId));
  }

  return drizzleDB.delete(transfers).where(eq(transfers.id, transfer.id));
};

export const updateTransfer = async (
  drizzleDB,
  transferId: number,
  updatedTransfer: Omit<Transfer, "id">
) => {
  // Get the original transfer
  const originalTransfer = await drizzleDB
    .select()
    .from(transfers)
    .where(eq(transfers.id, transferId))
    .get();

  if (!originalTransfer) {
    throw new Error(`Transfer with ID ${transferId} not found`);
  }

  // Get all unique accounts involved
  const uniqueAccountIds = Array.from(
    new Set([
      originalTransfer.fromAccountId,
      originalTransfer.toAccountId,
      updatedTransfer.fromAccountId,
      updatedTransfer.toAccountId,
    ])
  );

  const accountsMap = new Map();
  for (const accountId of uniqueAccountIds) {
    const account = await drizzleDB
      .select()
      .from(accounts)
      .where(eq(accounts.id, accountId))
      .get();

    if (!account) {
      throw new Error(`Account with ID ${accountId} not found`);
    }
    accountsMap.set(accountId, account);
  }

  // Calculate balance changes for each account
  const balanceChanges = new Map();

  // Initialize balance changes
  uniqueAccountIds.forEach((id) => {
    balanceChanges.set(id, 0);
  });

  // Reverse original transfer
  balanceChanges.set(
    originalTransfer.fromAccountId,
    balanceChanges.get(originalTransfer.fromAccountId) +
      Number(originalTransfer.amount)
  );
  balanceChanges.set(
    originalTransfer.toAccountId,
    balanceChanges.get(originalTransfer.toAccountId) -
      Number(originalTransfer.amount)
  );

  // Apply new transfer
  balanceChanges.set(
    updatedTransfer.fromAccountId,
    balanceChanges.get(updatedTransfer.fromAccountId) -
      Number(updatedTransfer.amount)
  );
  balanceChanges.set(
    updatedTransfer.toAccountId,
    balanceChanges.get(updatedTransfer.toAccountId) +
      Number(updatedTransfer.amount)
  );

  // Update account balances
  const updatePromises = [];
  for (const [accountId, change] of balanceChanges.entries()) {
    if (change !== 0) {
      const currentBalance = accountsMap.get(accountId).balance;
      const newBalance = currentBalance + change;

      updatePromises.push(
        drizzleDB
          .update(accounts)
          .set({ balance: newBalance })
          .where(eq(accounts.id, accountId))
      );
    }
  }

  // Execute all balance updates and transfer update concurrently
  const [updatedTransferRecord] = await Promise.all([
    drizzleDB
      .update(transfers)
      .set(updatedTransfer)
      .where(eq(transfers.id, transferId))
      .returning(),
    ...updatePromises,
  ]);

  return updatedTransferRecord[0];
};
