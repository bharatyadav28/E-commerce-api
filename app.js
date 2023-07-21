import express from "express";
import "express-async-errors";
import "dotenv/config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import url from "url";
import fileUpload from "express-fileupload";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";

import dbConnect from "./db/connect.js";
import notFoundMiddleware from "./middlewares/NotFound.js";
import errorHandlerMiddleware from "./middlewares/error-handler.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

const app = express();
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());

// app.use(morgan("tiny"));
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 4000;
const startServer = () => {
  try {
    dbConnect(process.env.MONGO_URI);
    console.log("Connected to Database successfully.");
    app.listen(PORT, console.log("Server started at http://localhost:4000"));
  } catch (error) {
    console.log(error);
  }
};
startServer();
