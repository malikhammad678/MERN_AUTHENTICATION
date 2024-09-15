import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { connectToDb } from './config/db.js';
import route from './routes/auth.route.js';

dotenv.config();
const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json())

app.use(cookieParser());

app.use("/api/auth",route);

const  PORT_NUMBER = process.env.PORT || 5000;

app.listen(PORT_NUMBER, () => {
    connectToDb();
    console.log(`Server is running on ${PORT_NUMBER}`);
})