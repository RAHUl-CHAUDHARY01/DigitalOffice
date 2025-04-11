import express from "express";
import { generateInviteLink, acceptInvite } from "../controllers/invite.controller.js";

const router = express.Router();

router.post("/generate", generateInviteLink);
router.post("/accept/:token", acceptInvite);

export default router;
