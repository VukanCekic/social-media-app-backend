import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import postRoutes from "./routes/posts.js";
import userRouter from "./routes/user.js";

import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const app = express();

// Images might be large in size, setting limit
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

app.use("/posts", postRoutes);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("Health Check, Success");
});

const CONNECTION_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.pkdbv7t.mongodb.net/social-media-app?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 5000;

try {
  await mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  app.listen(PORT, () => {
    console.log(`Server Running on Port: ${PORT}`);
    console.log(`Mongoose connection state: ${mongoose.connection.readyState}`);
  });
  mongoose.set("useFindAndModify", false);
} catch (error) {
  console.log(`${error} did not connect`);
}
