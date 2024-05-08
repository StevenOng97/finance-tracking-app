"use server";

import {
  categories,
  db,
  increment,
  monthHistories,
  transactions,
  users,
  yearHistories,
} from "@/db";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  const parsedBody = CreateTransactionSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { amount, category, date, description, type } = parsedBody.data;

  const getValueBaseOnType = (typeValue: "expense" | "income") => {
    if (type === typeValue) {
      return amount;
    } else {
      return 0;
    }
  };

  const categoryRow = await db.query.categories.findFirst({
    where: and(eq(categories.userId, user.id), eq(categories.name, category)),
  });

  if (!categoryRow) {
    throw new Error("category not found");
  }

  await db.transaction(async (tx) => {
    try {
      await db.insert(transactions).values({
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      });
    } catch (err) {
      console.log("Create transactions error: ", err);
    }

    try {
      await db
        .insert(monthHistories)
        .values({
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
          expense: getValueBaseOnType("expense"),
          income: getValueBaseOnType("income"),
        })
        .onConflictDoUpdate({
          target: [
            monthHistories.userId,
            monthHistories.day,
            monthHistories.month,
            monthHistories.year,
          ],
          set: {
            expense: increment(
              monthHistories.expense,
              getValueBaseOnType("expense")
            ),
            income: increment(
              monthHistories.income,
              getValueBaseOnType("income")
            ),
          },
        });
    } catch (err) {
      console.log("Create monthHistories error: ", err);
    }

    try {
      await db
        .insert(yearHistories)
        .values({
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
          expense: getValueBaseOnType("expense"),
          income: getValueBaseOnType("income"),
        })
        .onConflictDoUpdate({
          target: [
            yearHistories.userId,
            yearHistories.month,
            yearHistories.year,
          ],
          set: {
            expense: increment(
              yearHistories.expense,
              getValueBaseOnType("expense")
            ),
            income: increment(
              yearHistories.income,
              getValueBaseOnType("income")
            ),
          },
        });
    } catch (err) {
      console.log("Create yearHistories error: ", err);
    }
  });
}
