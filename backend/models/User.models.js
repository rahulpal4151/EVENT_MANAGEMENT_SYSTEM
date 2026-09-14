import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: { 
        type: String, 
        enum: ['Participant', 'Organizer', 'SuperAdmin'], 
        default: 'Participant' 
    },
    refreshToken: {
        type: String
    },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date }
}, { timestamps: true });


// Password ko save hone se pehle (PRE) hash karne ka middleware

userSchema.pre("save", async function () {
    // Agar password update/modify nahi hua hai, toh wapas hash mat karo (next pe jao)
    if (!this.isModified('password')) {
        return;
    }

    // Password Hash karo
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
})

// Password Check Method
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password);
}

// Access Token Generate Method
userSchema.methods.generateAccessTokenSecret = function(){
    return jwt.sign(
        {
            _id : this._id,
            email: this.email,
            name: this.name,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}

// Refresh Token Generate Method
userSchema.methods.generateRefreshToken = function(){
    // Refresh token mein payload kam rakhte hain (sirf ID)
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

const User = mongoose.model("User", userSchema);
export default User;