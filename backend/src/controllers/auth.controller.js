import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const SignUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      res.status(400).json({ message: "All feilds are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must contain 6 letters" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      // generate jwtToken
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ mesage: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in signup Controller", error.message);
    res.status(500).json({ message: "Internal server issue" });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isPassordCorrect = await bcrypt.compare(password, user.password);
    if (!isPassordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    generateToken(user._id, res);
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(201).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const updateProfile=async (req,res)=>{
    try {
        const {profilePic} = req.body
        const userId = req.user._id
        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"})
        }
        const updatedResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await  User.findByIdAndUpdate(userId,{profilePic:updatedResponse.secure_url},{new:true})
        res.status(200).json(updatedUser)
        
    } catch (error) {
        console.log("error in update profile",error.message);
        res.status(500).json({mesage:"internal server issue"})
        
    }
}

export const checkAuth =(req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in Check Auth Controller",error.message)
        res.status(500).json({message:"Internal Server Issue"})
    }
}