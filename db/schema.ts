import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  varchar,
  real,
  unique,
} from "drizzle-orm/pg-core";
import { AnyColumn, relations, sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id", { length: 191 }).primaryKey(),
  username: text("username"),
  email: text("email").notNull(),
  bio: text("bio"),
  firstName: text("firstName"),
  lastName: text("lastName"),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  userSettings: one(userSettings),
  transactions: many(transactions),
  categories: many(categories),
  monthHistories: many(monthHistories),
  yearHistories: many(yearHistories),
}));

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  currency: text("currency").notNull().default("USD"),
  userId: varchar("user_id", { length: 191 }).notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  amount: real("amount").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  userId: varchar("user_id", { length: 191 }).notNull(),
  category: text("category"),
  categoryIcon: text("categoryIcon"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  type: text("type").notNull().default("income"),
});

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    icon: text("icon").notNull(),
    type: text("type").notNull().default("income"),
    userId: varchar("user_id", { length: 191 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (category) => ({
    uniqueKey: unique("uniqueKey").on(
      category.name,
      category.userId,
      category.type
    ),
  })
);

export const monthHistories = pgTable(
  "month_histories",
  {
    day: integer("day").notNull(),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    income: real("income").notNull().default(0),
    expense: real("expense").notNull().default(0),
    userId: varchar("user_id", { length: 191 }).notNull(),
  },
  (monthHistory) => ({
    compoundKey: primaryKey({
      columns: [
        monthHistory.day,
        monthHistory.month,
        monthHistory.year,
        monthHistory.userId,
      ],
    }),
  })
);

export const yearHistories = pgTable(
  "year_histories",
  {
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    income: real("income").notNull().default(0),
    expense: real("expense").notNull().default(0),
    userId: varchar("user_id", { length: 191 }).notNull(),
  },
  (yearHistory) => ({
    compoundKey: primaryKey({
      columns: [yearHistory.month, yearHistory.year, yearHistory.userId],
    }),
  })
);

export const increment = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`;
};

export const decrement = (column: AnyColumn, value = 1) => {
  return sql`${column} - ${value}`;
};

export type UserSettings = typeof userSettings.$inferSelect;
export type Category = typeof categories.$inferSelect;
