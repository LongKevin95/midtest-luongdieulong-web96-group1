import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter.js";
import postRouter from "./routers/postRouter.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/users", userRouter);
app.use("/posts", postRouter);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to database");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });
