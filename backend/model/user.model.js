import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
   email:{
    type:String,
    required:true,
    unique:true
   },
   name:{
    type:String,
    required:true
   },
   password:{
    type:String,
    required:true
   },
   lastLogin:{
    type:Date,
    default:Date.now()
   },
   isVerified:{
    type:Boolean,
    default:false
   },
   resetPasswordToken:String,
   resetPasswordTokenExpiresAt:Date,
   verificationCode:String,
   verificationCodeExpiresAt:Date
},{timestamps:true})

const User = mongoose.model("user",userSchema);

export default User