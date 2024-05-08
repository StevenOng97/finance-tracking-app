"use server";

import { categories, db } from "@/db";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function CreateCategory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type } = parsedBody.data;

  const [createdCategory] = await db
    .insert(categories)
    .values({
      userId: user.id,
      name,
      icon,
      type,
    })
    .returning();
  return createdCategory;
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const [deletedCategory] = await db
    .delete(categories)
    .where(
      and(
        eq(categories.userId, user.id),
        eq(categories.name, parsedBody.data.name),
        eq(categories.type, parsedBody.data.type)
      )
    )
    .returning();
  return deletedCategory;
}
