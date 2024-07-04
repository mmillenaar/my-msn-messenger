"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../../controllers/users.controller");
const ensureAuth_middleware_1 = __importDefault(require("../../middlewares/ensureAuth.middleware"));
const userRouter = (0, express_1.Router)();
userRouter.route("/login").post(users_controller_1.postLogin);
userRouter.route("/logout").get(ensureAuth_middleware_1.default, users_controller_1.getLogout);
userRouter.route("/register").post(users_controller_1.postRegister);
userRouter.route("/auth").get(users_controller_1.checkUserAuth);
userRouter.route("/contact-request/send").post(ensureAuth_middleware_1.default, users_controller_1.sendContactRequest);
userRouter.route("/contact-request/accept").post(ensureAuth_middleware_1.default, users_controller_1.acceptContactRequest);
userRouter.route("/contact-request/reject").post(ensureAuth_middleware_1.default, users_controller_1.rejectContactRequest);
userRouter.route("/update/username").put(ensureAuth_middleware_1.default, users_controller_1.updateUsername);
userRouter.route("/search-contact").post(ensureAuth_middleware_1.default, users_controller_1.searchContacts);
exports.default = userRouter;
//# sourceMappingURL=user.route.js.map