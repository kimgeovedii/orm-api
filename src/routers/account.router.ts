import { Router } from "express";
import {
  createAccount,
  deleteAccount,
  getAccounts,
  getAverageAge,
  login,
  resetPassword,
  updateAccount,
} from "../controllers/account.controller";

const route: Router = Router();

route.get("/", getAccounts);
route.get("/aget-info", getAverageAge);
route.post("/create", createAccount);
route.post("/auth", login);
route.patch("/reset-password", resetPassword);
route.patch("/update/:id", updateAccount);
route.delete("/delete/:id", deleteAccount);

export default route;
