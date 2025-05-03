import express, { json } from "express";
import nodemon from "nodemon";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConnector from "./utils/dbConnect.js";
import userRouter from "./routes/users.js";
import ErrorHandler from "./utils/globalErrorHandler.js";
import redisConnect from "./utils/redisDB.js";
let app = express();
app.use(express.json());
app.use(morgan("short"));
dotenv.config();
dbConnector();

//------------------
let redisClient;
(async () => {
  try {
    redisClient = await redisConnect();
    app.locals.redisClient = redisClient; // Store the client in app.locals for reuse
  } catch (error) {
    console.error("Failed to initialize Redis:", error);
    process.exit(1); // Exit if Redis connection fails
  }
})();

//-----------------------
app.use("/user-api", userRouter);

app.use(ErrorHandler);

let host = process.env.HOST || "localhost";
let port = process.env.PORT || 5000;

app.listen(port, host, () => {
  console.log(`server is running at: http://${host}:${port}`);
});
