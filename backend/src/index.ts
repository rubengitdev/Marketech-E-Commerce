import express from "express";
import cors from "cors";


import { ENV } from "./config/env";
import { clerkMiddleware } from '@clerk/express'

const app = express();

app.use(cors({ origin: ENV.FRONTEND_URL }));
app.use(clerkMiddleware()); //auth object will be attached to the request object.
app.use(express.json()); // parses JSON request bodies.
app.use(express.urlencoded({ extended: true })); // parses form data (like HTML forms).

app.get(`/`, (req,res) => {
  res.json({ success: true});
});

app.listen(3000,() => console.log("Server is up and running on PORT:", ENV.PORT));