import jwt from 'jsonwebtoken'
import User from '../model/user.model.js'

export const protectedRoute = async (req,res,next) => {
    const token = req.cookies["jwt"]
    try {
        if(!token){
            return res.status(401).json({message: "Unauthorized" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(!decoded){
            return res.status(401).json({message: "Unauthorized" })
        }
        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(401).json({message: "Unauthorized" })
        }
        req.user = user
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error" })
    }
}