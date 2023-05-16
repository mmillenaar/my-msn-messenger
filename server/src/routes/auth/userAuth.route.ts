import { Router } from "express";
import { getCheckUserAuth } from "../../controllers/userAuth.controller";

const authRouter = Router();

authRouter
    .route('/user-auth')
    .get(getCheckUserAuth)

export default authRouter;