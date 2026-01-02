import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const siteTable = pgTable("site", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    code:text("code"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
})