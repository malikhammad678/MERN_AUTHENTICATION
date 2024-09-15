import { generateTokenAndSetCookie } from "../generateToken/generateTokenAndSetCookie.js"
import { sendForgetEmail, sendSuccessPassRecovery, sendVerifyEmail, sendWelcomeEmail } from "../mailtrap/emails.js"
import User from "../model/user.model.js"
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'


export const signup = async (req,res) => {
    const {email,password,name} = req.body
    try {
        if(!email || !password || !name){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields!"
            })
        }

        const isAlreadyExistEmail = await User.findOne({email})

        if(isAlreadyExistEmail){
            return res.status(400).json({
                success:false,
                message:"Email Already In Use!"
            })
        }

        if(password.length < 6){
            return res.status(400).json({
                success:false,
                message:"Password should be greater than 6 characters!"
            })
        }

        const hashedPassword = await bcryptjs.hash(password,10)
        let verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            name,
            password:hashedPassword,
            verificationCode,
            verificationCodeExpiresAt:Date.now() + 24 * 60 * 60 * 1000
        })

        await user.save();

        generateTokenAndSetCookie(user._id,res);
        sendVerifyEmail(user.email,verificationCode);
        res.status(201).json({
            success:true,
            message:"User created successfully!",
            user:{
                ...user._doc,
                password:undefined
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal server error!"
        })
    }
}

export const verifyEmail = async (req,res) => {
    const {token} = req.body
    try {
        const user = await User.findOne({
            verificationCode:token,
            verificationCodeExpiresAt:{$gt:Date.now()}
        })
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid verification code or expired!"
            })
        }

        user.isVerified = true,
        user.verificationCode = undefined,
        user.verificationCodeExpiresAt = undefined
        await user.save();
        await sendWelcomeEmail(user.email,user.name);
        res.status(200).json({
            success:true,
            message:"Email verified successfully!",
            user:{
                ...user._doc,
                password:undefined
            }
        })
    } catch (error) {
        
    }
}
export const login = async (req,res) => {
   const {email,password} = req.body;
   try {
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Please fill all the fields!"
        })
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({
            success:false,
            message:"Invalid Email or Password!"
        })
    }

    const inValidPassword = await bcryptjs.compare(password,user.password);
    if(!inValidPassword){
        return res.status(404).json({
            success:false,
            message:"Invalid Email or Password!"
        })
    }


    generateTokenAndSetCookie(user._id,res)

    res.status(200).json({
        success:true,
        message:"User logged in successfully!",
        user:{
            ...user._doc,
            password:undefined
        }
    })

   } catch (error) {
    console.log(error);
    res.status(400).json({
        success:false,
        message:"Internal server error!"
    })
   }
}

export const forgetPassword = async(req,res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email})
        if(!user){
            res.status(404).json({
                success:false,
                message:"Email in not found!"
            })
        }
        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
        await user.save();

        await sendForgetEmail(user.email,`http://localhost:5173/reset-password/${resetToken}`)

        res.status(200).json({
            success:true,
            message:"Password reset request sent successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const resetPassword = async (req,res) => {
    const { token } = req.params
    const {password} = req.body
    try {
       const user = await User.findOne({
        resetPasswordToken:token,
        resetPasswordTokenExpiresAt:{$gt:Date.now()}
       })
       if(!user){
        res.status(404).json({
            success:false,
            message:"Invalid or Expired Token"
        })
       }

       if(password.length < 6){
        res.status(404).json({
            success:false,
            message:"Password should be greater than 6 characters!"
        })
       }

       const hashedPassword = await bcryptjs.hash(password,10);
       user.password = hashedPassword
       user.resetPasswordToken = undefined
       user.resetPasswordTokenExpiresAt = undefined

       await user.save();
       await sendSuccessPassRecovery(user.email);
       res.status(200).json({
        success:true,
        message:"Password reset successfully"
    })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success:false,
            message:"Internal server error"
        })
    }
}
export const logout = async (req,res) => {
    try {
        res.clearCookie('jwt')
        res.status(200).json({
            success:true,
            message:"User logged out successfully!"
        })
    } catch (error) {
        console.log(error)
        res.status(200).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const checkAuth = async (req,res) => {
    try{
        res.status(200).json({
            success:true,
            message:"User is authenticated",
            user:req.user
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}