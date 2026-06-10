import { pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


// DATABASE TABLES

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  imageUrl: text("image_url"),
  createdAt: timestamp('createdAt', { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: "date" }).notNull().defaultNow()
});

// Products table
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("imageUrl").notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp('createdAt', { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: "date" }).notNull().defaultNow()
});

// Comments table
export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp('createdAt', { mode: "date" }).notNull().defaultNow()
});

// DATABASE RELATIONS

// Users Relations: One User can have many products and many comments
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products), // One User can have many products.
  comments: many(comments) // One User can have many comments.
}));

// Products Relations: One product can have many comments and one user
export const productsRelations = relations(products, ({ one, many }) => ({
  comments: many(comments), // One Product can have many comment.
  // `fields` = the foreign key column in THIS TABLE (products.userId).
  // `references` = the primary key column in the RELATED table (users.id).
  user: one(users, { fields: [products.userId], references: [users.id]}), // One Product can only have one user.
}));

// Comments Relations: One Comment can have one users and one product
export const commentsRelations = relations(comments, ({ one }) => ({
  // `fields` = the foreign key column in THIS TABLE (comments.userId).
  // `references` = the primary key column in the RELATED table (users.id).
  user: one(users, { fields: [comments.userId], references: [users.id]}), // One Comment can only have one user.
  // `fields` = the foreign key column in THIS TABLE (comments.productId).
  // `references` = the primary key column in the RELATED table (products.id).
  product: one(products, { fields: [comments.productId], references: [products.id]}) // One Comment can only have one product.
}));

// Type Inference Users
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Type Inference Products
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

// Type Inference Comments
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

