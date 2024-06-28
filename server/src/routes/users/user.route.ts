import { Router } from "express";
import { acceptContactRequest, checkUserAuth, getLogout, postLogin, postRegister, rejectContactRequest, searchContacts, sendContactRequest, updateUsername } from "../../controllers/users.controller";
import ensureAuthenticated from "../../middlewares/ensureAuth.middleware";

const userRouter = Router();

userRouter.route("/login").post(postLogin)

userRouter.route("/logout").get(ensureAuthenticated ,getLogout)

userRouter.route("/register").post(postRegister)

userRouter.route("/auth").get(ensureAuthenticated, checkUserAuth)

userRouter.route("/contact-request/send").post(ensureAuthenticated, sendContactRequest)

userRouter.route("/contact-request/accept").post(ensureAuthenticated, acceptContactRequest)

userRouter.route("/contact-request/reject").post(ensureAuthenticated, rejectContactRequest)

userRouter.route("/update/username").put(ensureAuthenticated, updateUsername)

userRouter.route("/search-contact").post(ensureAuthenticated, searchContacts)

export default userRouter;