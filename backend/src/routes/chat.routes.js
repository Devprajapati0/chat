import { Router } from "express";
import { createGroup } from "../controller/chat.controller.js";
import authenticator from "../middleware/jwt.middleware.js";
const router = Router();

router.route('/create-group').post(authenticator,createGroup);

export default router;