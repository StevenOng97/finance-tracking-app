import { categories as categoriesTable, db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get("type");

  const validator = z.enum(["expense", "income"]).nullable();

  const queryParams = validator.safeParse(paramType);
  if (!queryParams.success) {
    return Response.json(queryParams.error, {
      status: 400,
    });
  }

  const type = queryParams.data;
  const sql = type
    ? and(eq(categoriesTable.userId, user.id), eq(categoriesTable.type, type))
    : eq(categoriesTable.userId, user.id);
  const categories = await db.query.categories.findMany({
    where: sql,
    orderBy: (category, { asc }) => [asc(category.name)],
  });

  return Response.json(categories);
}
