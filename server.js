/*_____________________________ ALL IMPORTS START________________________________________________________ */
import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/Database.js";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morganLog from "morgan";
import winston from "winston";
import Jwt from "jsonwebtoken";
import router from "./routers/index.js";
dotenv.config();
const app = express();

/*______________________________________________IMPORTS END __________________________________________*/

/* _____________________________________MIDDLEWARE START ______________________________________________*/
const logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log" }),
  ],
});
app.use(
  morganLog("tiny", {
    stream: {
      write: (message) => {
        logger.info(message.trim());
      },
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
// Add a middleware to explicitly allow the required headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONT_END_HOME_URL);
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

/* _____________________________________MIDDLEWARE END ______________________________________________*/

/* _____________________________________ROUTER START ______________________________________________*/

app.use("/", router);
app.use("*", (req, res, next) => {
  next();
  return res.json({
    message: "Not Path Foud !",
    status: false,
  });
});
/*______________________________________________ROUTER END __________________________________________*/

/*______________________________________________SERVER PART__________________________________________*/
const PORT = 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Running in PORT : ${PORT}`);
  });
});

/*______________________________________________________SERVER END_________________________________________ */
