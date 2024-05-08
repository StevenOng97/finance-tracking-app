"use server";

import { db, userSettings as userSettingsTable, users } from "@/db";
import { UpdateUserCurrencySchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function UpdateUserCurrency(currency: string) {
  const parsedBody = UpdateUserCurrencySchema.safeParse({
    currency,
  });

  if (!parsedBody.success) {
    throw parsedBody.error;
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const [userSettings] = await db
    .insert(userSettingsTable)
    .values({
      currency,
      userId: user.id,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        currency,
      },
    })
    .returning();

  return userSettings;
}
