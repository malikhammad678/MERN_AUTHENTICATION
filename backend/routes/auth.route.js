import express from 'express'
import { checkAuth, forgetPassword, login, logout, resetPassword, signup, verifyEmail } from '../controller/auth.controller.js';
import { protectedRoute } from '../protectedroute/protected.route.js';

const route = express.Router();


route.post("/signup",signup)
route.post("/login",login)
route.post("/logout",logout)
route.post("/verify-email",verifyEmail)
route.get("/check-auth",protectedRoute,checkAuth)
route.post("/forget-password",forgetPassword)
route.post("/reset-password/:token",resetPassword)

export default route