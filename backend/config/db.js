import mongoose from 'mongoose'

export const connectToDb =async () => {
    try {
        const connect = await mongoose.connect(process.env.DB_URL)
        console.log(`MongoDB Connected Successfully: ${connect.connection.host}`)
    } catch (error) {
        console.log("Error in connecting DB",error);
    }
    
}