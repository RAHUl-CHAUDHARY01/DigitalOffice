import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const orgSchema = new mongoose.Schema({
    orgname :{
        type: String,
        required: true,
        unique : true,
        lowercase : true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required!!"]
    },
    refreshToken: {
        type: String,
    },
},

{
    timestamps: true
}
)
orgSchema.pre("save", async function (next) {

    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    console.log(this.password)
    next()
})

orgSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

orgSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            orgname: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

orgSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Org = mongoose.model("Org", orgSchema);