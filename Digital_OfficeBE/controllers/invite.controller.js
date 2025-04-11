import { v4 as uuidv4 } from "uuid";
import Invite from "../models/invite.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
export const generateInviteLink = asyncHandler(async (req, res) => {
  const { role, orgId } = req.body;
  if (!role) {
    throw new ApiError(400, "Role is required");
  }

  //Generate Token
  const token = uuidv4();

  //Save Invite
  const invite = await Invite.create({
    orgId,
    role,
    token
  });
  const inviteLink = `${process.env.FRONTEND_URL}/invite/accept/${token}`;

  res.status(201).json(new ApiResponse(201, { inviteLink }, "Invite link generated successfully"));
});


export const acceptInvite = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { fullname, email, password } = req.body;

  //Check if invite exists
  const invite = await Invite.findOne({ token });

  if (!invite) {
    throw new ApiError(404, "Invalid invite link");
  }

  if (invite.isUsed) {
    throw new ApiError(400, "Invite link already used");
  }

  if (new Date() > invite.expiresAt) {
    throw new ApiError(400, "Invite link expired");
  }

  //Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email already registered");
  }

  //Create user
  const user = await User.create({
    fullname,
    email,
    password,
    orgId: invite.orgId,
    role: invite.role
  });

  //Mark invite as used
  invite.isUsed = true;
  await invite.save();

  //Generate JWT Token
  const tokenResponse = user.generateAuthToken();

  res.status(201).json(new ApiResponse(201, { token: tokenResponse, user }, "User joined successfully"));
});
