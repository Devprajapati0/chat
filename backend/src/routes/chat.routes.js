import { Router } from "express";
import { createGroup,getMyChats,getMyGroups,addMembers,
    membersUseriaAllowesToAdd,
    removeMembers,
    makeAdmin,
    removeAdmin,leaveGroup } from "../controller/chat.controller.js";
import authenticator from "../middleware/jwt.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

router.route('/create-group').post(authenticator,upload.single("avatar"),createGroup);
router.route('/get-my-chats').get(authenticator,getMyChats);
router.route('/get-my-groups').get(authenticator,getMyGroups);
router.route('/add-members').put(authenticator,addMembers);
router.route('/remove-members').put(authenticator,removeMembers);
router.route('/make-admin').put(authenticator,makeAdmin);
router.route('/remove-admin').put(authenticator,removeAdmin);
router.route('/members-user-allowed-to-add').post(authenticator,membersUseriaAllowesToAdd);
router.route('/:chatId/leave-group').post(authenticator,leaveGroup);
// router.route('/get-chat/:chatId').get(authenticator,getChat);
// router.route('/get-group/:groupId').get(authenticator,getGroup);
// router.route('/get-group-messages/:groupId').get(authenticator,getGroupMessages);
// router.route('/get-chat-messages/:chatId').get(authenticator,getChatMessages);
// router.route('/get-chat-users/:chatId').get(authenticator,getChatUsers);
// router.route('/get-group-users/:groupId').get(authenticator,getGroupUsers);
// router.route('/get-group-admins/:groupId').get(authenticator,getGroupAdmins);
// router.route('/get-chat-admins/:chatId').get(authenticator,getChatAdmins);
// router.route('/get-chat-messages/:chatId').get(authenticator,getChatMessages);
// router.route('/get-group-messages/:groupId').get(authenticator,getGroupMessages);
// router.route('/get-chat-users/:chatId').get(authenticator,getChatUsers);
// router.route('/get-group-users/:groupId').get(authenticator,getGroupUsers);
// router.route('/get-chat-admins/:chatId').get(authenticator,getChatAdmins);
export default router  