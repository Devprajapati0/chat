import { Router } from "express";
// import { sendAttachments,createMessage } from "../controller/message.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import authenticator from "../middleware/jwt.middleware.js";
import { getIndivisualChatMessage ,sendMessage} from "../controller/message.controller.js";
const router = Router();

// router.route('/send-attachments').post(authenticator, upload.array("attachments"), sendAttachments);
// router.route('/create').post(authenticator, createMessage);

router.route('/send').post(authenticator, upload.array("attachments"), sendMessage);
router.route('/:chatId').get(authenticator,getIndivisualChatMessage);

export default router;

   