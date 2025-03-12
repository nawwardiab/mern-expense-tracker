import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./utils/database.js";
// import usersRouter from "./routes/usersRouter.js";
// import {
//   globalErrorHandler,
//   routeNotFound,
// } from "./middleware/errorHandlers.js";

await connectDB();
const app = express();

const PORT = process.env.PORT || 6000;

app.use(cors());
app.use(express.json());

// app.use("/users", usersRouter);

// app.use(routeNotFound);
// app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(
    `🚀 Server is up and running!\n` +
      `🌐 Listening on http://localhost:${PORT}\n` +
      `📅 Started at: ${new Date().toLocaleString()}\n`
  );
});
