import { Router } from "express";
import { createAccount, getAccounts } from "../controllers/account.controller";

const route: Router = Router();

route.post("/create", createAccount);
route.get("/", getAccounts);

export default route;
