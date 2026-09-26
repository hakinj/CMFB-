import {
  pgTable,
  pgEnum,
  uuid,
  text,
  numeric,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

// --- Enums ---
export const appRoleEnum = pgEnum("app_role", ["admin", "user"]);
export const userStatusEnum = pgEnum("user_status", ["active", "restricted", "pending"]);
export const transactionDirectionEnum = pgEnum("transaction_direction", ["credit", "debit"]);
export const transactionStateEnum = pgEnum("transaction_state", ["completed", "pending", "failed"]);

// --- Accounts Table ---
export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  kind: text("kind").notNull(),
  accountNumber: text("account_number").notNull(),
  routingNumber: text("routing_number").notNull(),
  balance: numeric("balance").notNull(),
  currency: text("currency").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- Audit Logs Table ---
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  action: text("action").notNull(),
  detail: text("detail").notNull(),
  severity: text("severity").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- Beneficiaries Table ---
export const beneficiaries = pgTable("beneficiaries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  nickname: text("nickname"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- Cards Table ---
export const cards = pgTable("cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  accountId: uuid("account_id"),
  label: text("label").notNull(),
  brand: text("brand").notNull(),
  last4: text("last4").notNull(),
  expMonth: integer("exp_month").notNull(),
  expYear: integer("exp_year").notNull(),
  cardType: text("card_type").notNull(),
  frozen: boolean("frozen").notNull().default(false),
  monthlyLimit: numeric("monthly_limit").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- Notifications Table ---
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  kind: text("kind").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- Profiles Table ---
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  address: text("address"),
  status: userStatusEnum("status").notNull(),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- Transactions Table ---
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  accountId: uuid("account_id").notNull(),
  direction: transactionDirectionEnum("direction").notNull(),
  amount: numeric("amount").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  counterparty: text("counterparty"),
  state: transactionStateEnum("state").notNull(),
  reference: text("reference").notNull(),
  balanceAfter: numeric("balance_after").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- User Roles Table ---
export const userRoles = pgTable("user_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  role: appRoleEnum("role").notNull(),
});