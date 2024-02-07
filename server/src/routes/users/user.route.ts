import { Router } from "express";
import { acceptContactRequest, checkUserAuth, getLogout, postLogin, postRegister, rejectContactRequest, sendContactRequest } from "../../controllers/users.controller";
// import { checkUserAuth } from "../../controllers/userAuth.controller";

const userRouter = Router();

userRouter.route("/login").post(postLogin)

userRouter.route("/logout").get(getLogout)

userRouter.route("/register").post(postRegister)

userRouter.route("/auth").get(checkUserAuth)

userRouter.route("/contact-request/send").post(sendContactRequest)

userRouter.route("/contact-request/accept").post(acceptContactRequest)

userRouter.route("/contact-request/reject").post(rejectContactRequest)

export default userRouter;