import express from "express";
import cors from "cors";

import { ENV } from "./config/env";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = express();

app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true })); // credentials:true allows frontend to send cookies to backend so that we can authenticate the user.
app.use(clerkMiddleware()); //auth object will be attached to the request object.
app.use(express.json()); // parses JSON request bodies.
app.use(express.urlencoded({ extended: true })); // parses form data (like HTML forms).

app.get(`/`, (req, res) => {
  res.json({
    message:
      "Welcome to Marketech powered by PostgreSQL, Drizzle-ORM, and Clerk Auth",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

app.listen(3000, () =>
  console.log("Server is up and running on PORT:", ENV.PORT),
);
