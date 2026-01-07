import { Router } from "express";
import {
  createAccount,
  deleteAccount,
  getAccounts,
  getAverageAge,
  updateAccount,
} from "../controllers/account.controller";

const route: Router = Router();

route.get("/", getAccounts);
route.get("/aget-info", getAverageAge);
route.post("/create", createAccount);
route.patch("/update/:id", updateAccount);
route.delete("/delete/:id", deleteAccount);

export default route;
