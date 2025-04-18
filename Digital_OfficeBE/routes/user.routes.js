import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, updatePassword, getProfile, updateEmail, updateProfilePic } from "../controllers/userAuth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router()



router.route("/login").post(loginUser)
router.route("/refresh-tokens").post(refreshAccessToken)
router.route("/logout").post(authMiddleware, logoutUser)
router.route('/update-password').patch(authMiddleware, updatePassword);
router.route('/profile').get(authMiddleware, getProfile);
router.route('/update-email').post(authMiddleware, updateEmail)
router.route('/update-profile-pic').patch(authMiddleware, upload.single('profile_image'), updateProfilePic);

export default router;