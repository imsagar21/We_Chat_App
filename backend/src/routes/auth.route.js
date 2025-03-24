import express from "express"
import { checkAuth, Login, Logout, SignUp, updateProfile } from "../controllers/auth.controller.js"
import {protectRoute } from "../middleware/auth.middleware.js"


const router = express.Router()


router.post("/signup",SignUp)
router.post("/login",Login)
router.post("/logout",Logout)
router.post("/update-profile",protectRoute,updateProfile)
router.get("/check",protectRoute,checkAuth)

export default router