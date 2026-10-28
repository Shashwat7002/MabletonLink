import {sqliteTable, text, integer, index} from "drizzle-orm/sqlite-core";
export const assistantUsage = sqliteTable("assistant_usage", {
 bucket: text("bucket").primaryKey(),
 count: integer("count").notNull(),
 expiresAt: integer("expires_at").notNull(),
}, table => [index("assistant_usage_expiry").on(table.expiresAt)]);
