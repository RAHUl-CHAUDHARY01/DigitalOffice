import Redis from 'ioredis';
import nodemailer from 'nodemailer';


const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  // password: process.env.REDIS_PASSWORD, // if needed
});

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP with 5-minute expiry
export const storeOTPTemp = async ({ email, otp }) => {
  const key = `otp:${email}`;
  await redis.set(key, otp, 'EX', 300); // 5 minutes
};

// Verify OTP
export const verifyStoredOTP = async ({ email,otp }) => {
  const key = `otp:${email}`;
  const storedOTP = await redis.get(key);
  return storedOTP == otp;
};

// Delete OTP after verification
export const deleteStoredOTP = async ({ email}) => {
  const key = `otp:${email}`;
  await redis.del(key);
};

// Check if OTP was verified before registering
export const isOTPVerified = async ({ email}) => {
  const key = `otp_verified:${email}`;
  const verified = await redis.get(key);
  console.log(verified);
  return verified === 'true';
};

// After successful OTP verification, mark it verified
export const markOTPVerified = async ({ email }) => {
    const identifier = email ;
  
    // if (!identifier) {
    //   throw new Error("Email or phone number is required to mark OTP as verified");
    // }
  
    const key = `otp_verified:${identifier}`;
    console.log('Setting key:', key);
  
    await redis.set(key, 'true', 'EX', 600); // 10 mins
  };
  

// -------------- OTP SENDING LOGIC --------------

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  

  
  const sendOtpByEmail = async (email, otp) => {
    const mailOptions = {
      from: `"E commerce" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
    };
  
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP sent via email:', info.response);
  };
  

  
  export const sendOTPToEmail = async ({ email,otp }) => {
    if (email) {
      await sendOtpByEmail(email, otp);
    } 
    else {
      throw new Error("No email  provided to send OTP.");
    }
  };