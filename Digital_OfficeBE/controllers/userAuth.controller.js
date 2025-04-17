import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { setCookie } from '../utils/cookie.js';
import db from '../models/index.js'
const {User,CompanyMembership}=db


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
  
    if (!user) {
      return res.status(401).json({ message: 'Invalid Email' });
    }
  
    // Check password
    const isPasswordMatch = await User.comparePassword(password, user.password);
  
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
  
    // Get user role from memberships
    const membership = await CompanyMembership.findOne({
      where: { user_id: user.user_id },
    });
  
    if (!membership) {
      return res.status(403).json({ message: 'User is not associated with any company' });
    }
  
    const role = membership.role;
  
    // Generate access & refresh tokens

    const accessToken = generateAccessToken({
        user_id: user.user_id,
        company_id: user.company_id
      });
    
      const refreshToken = generateRefreshToken({
        user_id: user.user_id
      });


      // Save refresh token in DB
    user.refresh_token = refreshToken;
    await user.save();
  
    // Set access and refresh tokens in HttpOnly cookies
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000,
    });
  
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  
    // Return user info (not tokens)
    return res.status(200).json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        comapny_id:user.company_id,
        role,
      },
    });
  });

  const refreshAccessToken = asyncHandler(async (req, res) => {

  const tokenFromCookie = req.cookies.refresh_token;

  if (!tokenFromCookie) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  // Verify refresh token

  let payload; // this will have everything that is given for generating access_token

  try {
    payload = jwt.verify(tokenFromCookie, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }

  // Find user by id and validate token matches DB
  const user = await User.findOne({ where: { user_id: payload.user_id } });


  if (!user || user.refresh_token !== tokenFromCookie) {
    return res.status(403).json({ message: 'Refresh token mismatch or user not found' });
  }

  //Refresh Token Rotation: Generate a new refresh token
  const newRefreshToken = generateRefreshToken({ user_id: user.user_id });


  user.refresh_token = newRefreshToken;
  await user.save();

  // Generate new access token
  const newAccessToken = generateAccessToken({
        user_id: user.user_id,
        company_id: user.company_id
      });

  // Set cookies
  setCookie(res, 'access_token', newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000, // 15 min
  });

  setCookie(res, 'refresh_token', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json({ message: 'Tokens refreshed successfully' });
});



export {loginUser,refreshAccessToken};