import { Router } from "express";
import { getLogout } from "../../controllers/users.controller";

const logoutRouter = Router()

logoutRouter
    .route("/")
    .get(getLogout)

export default logoutRouter
