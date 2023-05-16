import { Router } from "express";
import { getRoot } from "../../controllers/home.controller";
import ensureAuthenticated from "../../middlewares/ensureAuth.middleware";

const homeRouter = Router();

homeRouter
    .route('/')
    .get(ensureAuthenticated, getRoot)

export default homeRouter;