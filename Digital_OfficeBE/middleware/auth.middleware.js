import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Org } from "../models/org.model.js";
import {User} from "../models/user.model.js";

// ✅ Smart JWT Verification Middleware
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // ✅ Extract token from cookies or headers
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("token" , token);

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // ✅ Decode token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("decodedToken",decodedToken)
        // ✅ Check if token contains orgId or userId
        if (decodedToken?._id) {
            // ✅ This is an Organization's token
            const org = await Org.findById(decodedToken._id).select("-password -refreshToken");
            if (!org) {
                throw new ApiError(401, "Invalid Access Token");
            }

            // ✅ Attach org to req
            req.org = org;
            req.user = null;  // Reset user to avoid misuse
        }
        else if (decodedToken?.id) {
            // ✅ This is a User's token (from invite link)
            const user = await User.findById(decodedToken.id).select("-password");
            if (!user) {
                throw new ApiError(401, "Invalid Access Token");
            }

            // ✅ Attach user to req
            req.user = user;
            req.org = null;  // Reset org to avoid misuse
        }
        else {
            throw new ApiError(401, "Invalid Token Structure");
        }

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
