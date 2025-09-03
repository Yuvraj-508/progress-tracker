import User from "../Models/User.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });
     
    const token = Jwt.sign({id:user._id},process.env.JWT_SECRET,{
      expiresIn:"7d"
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};


export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
const token = Jwt.sign({id:user._id},process.env.JWT_SECRET,{
      expiresIn:"7d"
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
       path: "/",    
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const Logout = async (req,res)=>{
    try {
        res.clearCookie('token',{
          httpOnly: true,
          secure: true, // ✅ required for HTTPS
          sameSite: 'None', // ✅ allow cross-origin cookies
          path: "/",  
        });
        return res.status(200).json({success:true,message:"Logged out successfully"});
    } catch (error) {
        console.log(err.message);
        res.status(500).json({success:false,message:err.message});
    }
}

export const isAuth = async (req, res) => {
  try {
    const {id}= req.user;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
    } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
    }
}
