import { db } from "./index";
import { desc, eq } from "drizzle-orm";
import {
  users,
  comments,
  products,
  type NewUser,
  type NewProduct,
  type NewComment,
} from "./schema";

// USER QUERIES ----------------------------------------------------------

// Create User
export const createUser = async (data:NewUser) => {
  const [user] = await db.insert(users).values(data).returning();
  return user;
};

// Get User By Id
export const getUserById = async (id:string) => {
  return db.query.users.findFirst({ where: eq(users.id, id)});
};

// Update User
export const updateUser = async (id:string, data: Partial<NewUser>) => {
  const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return user;
};

// Upsert User => Create or Update User
export const upsertUser = async (data:NewUser) => {
  const existingUser = await getUserById(data.id);
  if(existingUser) return updateUser(data.id, data);
  return createUser(data);
};

// PRODUCT QUERIES --------------------------------------------------------

// Create Product
export const createProduct = async (data:NewProduct) => {
  const [product] = await db.insert(products).values(data).returning();
  return product;
};

// Get All Products
export const getAllProducts = async () =>{
  return db.query.products.findMany({
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};

// Get Product by ID
export const getProductById = async (id:string) => {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      user:true,
      comments: {
        with: {user:true},
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      },
    },
  });
};

// Get All Products by User ID
export const getProductByUserId = async (userId:string) => {
  return db.query.products.findMany({
    where: eq(products.userId, userId),
    with: { user: true },
    orderBy: (products, {desc}) => [desc(products.createdAt)],
  });
};

// Update Product
export const updateProduct = async (id: string, data: Partial<NewProduct>) => {
  const [product] = await db.update(products).set(data).where(eq(products.id, id)).returning();
  return product;
};

// Delete Product by ID
export const deleteProduct = async (id: string) => {
  const [product] = await db.delete(products).where(eq(products.id, id)).returning();
  return product;
};

// COMMENT QUERIES --------------------------------------------------------------

// Create Comments
export const createComment = async (data:NewComment) => {
  const [comment] = await db.insert(comments).values(data).returning();
  return comment;
};

// Get Comments by Id
export const getCommentById = async (id:string) =>{
  return db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: { user: true },
  });
};

// Delete Comment by Id
export const deleteComment = async (id: string) => {
  const [comment] = await db.delete(comments).where(eq(comments.id, id)).returning();
  return comment;
};