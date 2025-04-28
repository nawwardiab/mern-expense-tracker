import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import "dotenv/config";

import connectDB from "./utils/database.js";
import usersRouter from "./routes/usersRouter.js";
import expensesRouter from "./routes/expensesRouter.js";
import paymentRouter from "./routes/paymentRouter.js";
import groupsRouter from "./routes/groupsRouter.js";
import inviteRouter from "./routes/inviteRouter.js";
import groupBalanceRouter from "./routes/groupBalanceRouter.js";
import {
  globalErrorHandler,
  routeNotFound,
} from "./middleware/errorHandler.js";

await connectDB(); // Top level await module
const app = express();

const PORT = process.env.PORT || 6000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

//? Routers
app.use("/users", usersRouter);
app.use("/expenses", expensesRouter);
app.use("/groups", groupsRouter);
app.use("/invites", inviteRouter);
app.use("/payments", paymentRouter);
app.use("/balances", groupBalanceRouter);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//! Error Handlers
app.use(routeNotFound);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(
    `🚀 Server is up and running!\n` +
      `🌐 Listening on http://localhost:${PORT}\n` +
      `📅 Started at: ${new Date().toLocaleString()}\n`
  );
});
