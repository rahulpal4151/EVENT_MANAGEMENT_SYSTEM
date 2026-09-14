import User from "../models/User.models.js";
import sendEmail from "../utils/sendEmail.js";

// ==========================================
// 1. REGISTER (SIGNUP) CONTROLLER
// ==========================================
const registerUser = async (req, res) => {
  try {
    // 1. Frontend se data receive karna
    const { name, email: rawEmail, password, role } = req.body;
    const email = rawEmail?.trim().toLowerCase();

    // 2. Validation: Koi field khali toh nahi hai?
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter the details" });
    }

    // 3. Check karna ki user pehle se toh nahi hai
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(409)
        .json({ success: false, message: "User already exist" });
    }

    // PEHLE OTP aur Expiry banayein
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    // 4. Naya user database mein create karna
    // (Password hash automatically 'pre-save' hook se ho jayega jo humne User.js me likha tha)
    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpires,
      isVerified: false,
      role: ["Participant", "Organizer"].includes(role) ? role : "Participant",
    });

    if (user) {
      const text = `Hi ${name}!, You have recently visited our website and entered your email. Please use the following one-time-password (OTP):
            Your OTP is : ${otp}
            Thanks`;
      try {
        await sendEmail(
          user.email,
          "Welcome to Eventora - Your OTP for registration",
          text,
        );
      } catch (mailError) {
        console.log("Email sending failed:", mailError.message);
      }

      // Token verifyOTP ke baad milega, yahan sirf success response bhejein
      return res.status(201).json({
        success: true,
        message: "OTP sent to email. Please verify.",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user data" });
    }

    // 5. Response bhejne ke liye password hide karna
    // const createdUser = await User.findById(user._id).select("-password");

    // res.status(201).json({
    //   success: true,
    //   message: "Account created successfully.",
    //   user: createdUser,
    // });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// TRY Verify Otp
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  console.log("👉 Frontend se aaya:", { email, otp });

  try {
    const user = await User.findOne({ email });

    console.log("👉 DB mein user mila:", user ? "Haan" : "Nahi");
    if (user) {
      console.log("👉 DB ka OTP:", user.otp, "Type:", typeof user.otp);
      console.log("👉 User input OTP:", otp, "Type:", typeof otp);
      console.log(
        "👉 Expiry time:",
        user.otpExpires,
        "Current time:",
        new Date(),
      );
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (String(user.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.otpExpires && new Date(user.otpExpires) < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: "Email verified successfully!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. LOGIN CONTROLLER
// ==========================================

const loginUser = async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;
    const email = rawEmail?.trim().toLowerCase();
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 1. User find karna
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    // 2. Password check karna (User model ka method call karke)
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Tokens generate karna
    const accessToken = user.generateAccessTokenSecret();
    const refreshToken = user.generateRefreshToken();

    // 4. Refresh token ko database mein save karna
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // { validateBeforeSave: false } lagane se Mongoose poore schema ke required rules check karne mein time waste nahi karta aur jaldi save kar deta hai.
    // Is time dobara password hash nahi hoga

    // 5. Response se password aur refresh token hide karna
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    // 6. Cookies options (Security ke liye) Yeh tokens ko browser mein store karne ka sabse secure tareeka hai.
    const cookieOptions = {
      httpOnly: true, // Frontend JavaScript ise access nahi kar payegi (XSS attack se bachata hai)
      secure: process.env.NODE_ENV === "production", // HTTPS par hi kaam karega
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    // 7. Cookies set karke response bhejna
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        success: true,
        message: "User logged in successfully",
        user: loggedInUser,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Logout logic
export const logoutUser = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export { registerUser, loginUser, verifyOTP };
