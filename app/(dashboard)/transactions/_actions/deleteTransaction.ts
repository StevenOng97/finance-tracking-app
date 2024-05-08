"use server";

import {
  db,
  decrement,
  monthHistories,
  transactions,
  yearHistories,
} from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function DeleteTransaction(id: string) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const transaction = await db.query.transactions.findFirst({
    where: and(
      eq(transactions.userId, user.id),
      eq(transactions.id, parseInt(id))
    ),
  });

  if (!transaction) {
    throw new Error("bad request");
  }

  await db.transaction(async (tx) => {
    await db
      .delete(transactions)
      .where(
        and(eq(transactions.userId, user.id), eq(transactions.id, parseInt(id)))
      );

    await db.update(monthHistories).set({
      ...(transaction.type === "expense" && {
        expense: decrement(monthHistories.expense, transaction.amount),
      }),
      ...(transaction.type === "income" && {
        income: decrement(monthHistories.income, transaction.amount),
      }),
    });

    await db.update(yearHistories).set({
      ...(transaction.type === "expense" && {
        expense: decrement(yearHistories.expense, transaction.amount),
      }),
      ...(transaction.type === "income" && {
        income: decrement(yearHistories.income, transaction.amount),
      }),
    });
  });
}
