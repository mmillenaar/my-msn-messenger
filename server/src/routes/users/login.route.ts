import { Router } from "express";
import { postLogin } from "../../controllers/users.controller";

const loginRouter = Router();

loginRouter
    .route("/")
    .post(postLogin)

export default loginRouter;