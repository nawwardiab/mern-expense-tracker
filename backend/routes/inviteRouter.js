import express from "express";
import checkToken from "../middleware/checkToken.js";

import {
  createInviteLink,
  validateInviteToken,
  acceptInvite,
  inviteByEmail,
} from "../controllers/inviteController.js";

const router = express.Router();

router.use(checkToken);

router
  .post("/:groupId/create", createInviteLink)
  .post("/:groupId/email", inviteByEmail)
  .get("/:token/validate", validateInviteToken)
  .patch("/:token/accept", acceptInvite);

export default router;
