import { User} from '../models/user.js'

import {
    generateOTP,
    storeOTPTemp,
    verifyStoredOTP,
    sendOTPToEmail,
    deleteStoredOTP,
    markOTPVerified,
} from '../utils/otp.helper.js';

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user already exists using Sequelize
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate and send OTP
    const otp = generateOTP();
    console.log('otp is', otp);

    await storeOTPTemp({ email, otp });
    await sendOTPToEmail({ email, otp });

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error('Error sending OTP:', err);
    return res.status(500).json({ error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const isValid = await verifyStoredOTP({ email, otp });
  
      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
  
      // OTP is valid — delete it
      await deleteStoredOTP({ email });
  
      await markOTPVerified({ email});
  
      return res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
      console.error('OTP verification error:', err);
      return res.status(500).json({ error: err.message });
    }
  };

