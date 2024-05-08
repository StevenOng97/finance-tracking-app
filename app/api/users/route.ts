import { db, users } from "@/db";
import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { id, firstName, lastName, username, imageUrl, email } = data;

  const exists = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  // If the user already exists in the database, we only update it.
  if (!!exists) {
    try {
      await db
        .update(users)
        .set({
          firstName,
          lastName,
          username,
          imageUrl,
          email,
        })
        .where(eq(users.id, id));
    } catch (err) {
      return new Response(`Error updating user: ${err}`, {
        status: 400,
      });
    }
  } else {
    try {
      const res = await db
        .insert(users)
        .values({
          firstName,
          lastName,
          email,
          username,
          imageUrl,
          id,
        })
        .returning();
      console.log("res:", res);
    } catch (err) {
      return new Response(`Error creating user: ${err}`, {
        status: 400,
      });
    }

    const createdUser = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (createdUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          databaseId: createdUser.id,
        },
      });
    }
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
