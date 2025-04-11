import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "manager", "member"],
    default: "member"
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Org",
    required: true
  }
}, { timestamps: true });

//Hash the password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

//Generate JWT Token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      id: this._id,
      orgId: this.orgId,
      role: this.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const User = mongoose.model("User", userSchema);
