import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Org",
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "manager", "member"],
    required: true
  },
  token: {
    type: String,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000  // 7 days expiry
  }
}, { timestamps: true });

const Invite = mongoose.model("Invite", inviteSchema);
export default Invite;
