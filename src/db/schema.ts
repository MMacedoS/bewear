import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
});

export const categoryTable = pgTable("category", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  created_at: timestamp().notNull().defaultNow(),
});

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  products: many(productTable),
}));

export const productTable = pgTable("product", {
  id: uuid().primaryKey().defaultRandom(),
  category_id: uuid()
    .notNull()
    .references(() => categoryTable.id),
  name: text().notNull(),
  slug: text().notNull(),
  description: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});

export const productRelations = relations(productTable, ({ one, many }) => ({
  category: one(categoryTable, {
    fields: [productTable.category_id],
    references: [categoryTable.id],
  }),
  variants: many(productVariantsTable),
}));

export const productVariantsTable = pgTable("product_variant", {
  id: uuid().primaryKey().defaultRandom(),
  product_id: uuid()
    .notNull()
    .references(() => productTable.id),
  name: text().notNull(),
  slug: text().notNull().unique(),
  price_in_cents: integer().notNull(),
  color: text().notNull(),
  image_url: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});

export const productVariantRelations = relations(
  productVariantsTable,
  ({ one }) => ({
    product: one(productTable, {
      fields: [productVariantsTable.product_id],
      references: [productTable.id],
    }),
  })
);
