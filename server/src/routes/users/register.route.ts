import { Router } from "express";
import { postRegister } from "../../controllers/users.controller";

const registerRouter = Router();

registerRouter
    .route("/")
    .post(postRegister)

export default registerRouter;