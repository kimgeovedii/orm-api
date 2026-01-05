import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import accountRouter from "./routers/account.router";
// Load environtment variable
dotenv.config();
const PORT: string = process.env.PORT || "5555";

// initialize express API Server
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/accounts", accountRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`API RUNNING at http://localhost:${PORT}`);
});
