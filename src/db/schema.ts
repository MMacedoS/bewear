import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userRelations = relations(userTable, ({ many, one }) => ({
  shippingAddresses: many(shippingAddressTable),
  cart: one(cartTable, {
    fields: [userTable.id],
    references: [cartTable.user_id],
  }),
}));

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const accountTable = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
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
    .references(() => categoryTable.id, { onDelete: "set null" }),
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
    .references(() => productTable.id, { onDelete: "cascade" }),
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
    item: one(cartItemsTable, {
      fields: [productVariantsTable.id],
      references: [cartItemsTable.product_variant_id],
    }),
  })
);

export const verificationTable = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const shippingAddressTable = pgTable("shipping_address", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: text()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  recipient_name: text().notNull(),
  street: text().notNull(),
  number: text(),
  complement: text(),
  neighborhood: text().notNull(),
  zipCode: text().notNull(),
  city: text().notNull(),
  state: text().notNull(),
  country: text().notNull(),
  phone: text().notNull(),
  email: text().notNull(),
  cpf_or_cnpj: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const shippingAddressRelations = relations(
  shippingAddressTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [shippingAddressTable.user_id],
      references: [userTable.id],
    }),
    cart: one(cartTable, {
      fields: [shippingAddressTable.id],
      references: [cartTable.shipping_address_id],
    }),
  })
);

export const cartTable = pgTable("cart", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: text()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  shipping_address_id: uuid().references(() => shippingAddressTable.id, {
    onDelete: "set null",
  }),
  created_at: timestamp().notNull().defaultNow(),
});

export const cartRelations = relations(cartTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [cartTable.user_id],
    references: [userTable.id],
  }),
  shippingAddress: one(shippingAddressTable, {
    fields: [cartTable.shipping_address_id],
    references: [shippingAddressTable.id],
  }),
  items: many(cartItemsTable),
}));

export const cartItemsTable = pgTable("cart_item", {
  id: uuid().primaryKey().defaultRandom(),
  cart_id: uuid()
    .notNull()
    .references(() => cartTable.id, { onDelete: "cascade" }),
  product_variant_id: uuid()
    .notNull()
    .references(() => productVariantsTable.id, { onDelete: "cascade" }),
  quantity: integer().notNull().default(1),
  created_at: timestamp().notNull().defaultNow(),
});

export const cartItemRelations = relations(cartItemsTable, ({ one }) => ({
  cart: one(cartTable, {
    fields: [cartItemsTable.cart_id],
    references: [cartTable.id],
  }),
  product_variant: one(productVariantsTable, {
    fields: [cartItemsTable.product_variant_id],
    references: [productVariantsTable.id],
  }),
}));
