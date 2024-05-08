import { db, userSettings as userSettingsTable } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  let userSettings = await db
    .select()
    .from(userSettingsTable)
    .where(eq(userSettingsTable.userId, user.id));

  if (!userSettings) {
    userSettings = await db
      .insert(userSettingsTable)
      .values({
        userId: user.id,
        currency: "USD",
      })
      .returning();
  }

  // Revalidate the home page that uses the user currency
  revalidatePath("/");
  return Response.json(userSettings);
}
