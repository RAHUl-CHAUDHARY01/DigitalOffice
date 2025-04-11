import { Router } from "express";
import { registerOrg, loginOrg, logoutOrg ,refreshAccessToken,deleteAccount} from "../controllers/org.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router()
router.route('/register').post(registerOrg);

router.route("/login").post(loginOrg)
router.route("/logout").post(verifyJWT, logoutOrg)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/delete-account").delete(verifyJWT, deleteAccount)

export default router;