import { Router } from "express";
import { loginUser,refreshAccessToken } from "../controllers/userAuth.controller.js";
// import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router()



router.route("/login").post(loginUser)
router.route("/refresh-tokens").post(refreshAccessToken)

// router.route("/logout").post(verifyJWT, logoutOrg)
// router.route("/delete-account").delete(verifyJWT, deleteAccount)

export default router;