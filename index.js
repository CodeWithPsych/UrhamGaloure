import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import bodyParser from "body-parser";
import passport from "./middlewares/passport.js";
import productRouter from "./routes/productRouter.js";
import authRouter from "./routes/authRouter.js";
import brandRouter from "./routes/brandRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import deletedProductsRouter from "./routes/deletedProductRouter.js";
import userRouter from "./routes/userRouter.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRouter.js";
import deletedOrderRouter from "./routes/deletedOrdersRouter.js";
import { isAuth } from "./services/common.js";
import { stripePayment } from "./middlewares/stripe.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "dist")));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: [
      "totalItems",
      "totalOrders",
      "totaldeletedItems",
      "totalDeletedOrders",
    ],
  })
);
app.use(cookieParser());

app.use(
  session({
    secret: process.env.Session,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport initialization
app.use(passport.authenticate("session"));

// Routes
app.use("/api", authRouter);
app.use("/api", isAuth(), productRouter);
app.use("/api", isAuth(), brandRouter);
app.use("/api", isAuth(), categoryRouter);
app.use("/api", isAuth(), deletedProductsRouter);
app.use("/api", isAuth(), userRouter);
app.use("/api", isAuth(), cartRouter);
app.use("/api", isAuth(), orderRouter);
app.use("/api", isAuth(), deletedOrderRouter);
app.post("/create-payment-intent", stripePayment);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥`));
    console.log("MongoDB connected ...");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
