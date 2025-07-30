import express from "express";
import cors from "cors";
import 'dotenv/config'
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRoutes.js";
import router from './routes/authRoutes.js'

import connectDB from './config/connect.js'

import path from 'path';

const allowedOrigins=['http://localhost:5173'];

const app=express();
const PORT=process.env.PORT || 4000
connectDB();


app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}));

app.get('/',(req,res)=>{
    res.send("hello");
})
app.use('/api/auth',router);
app.use('/api/user',userRouter);



app.listen(PORT ,()=>{
    console.log("Server Started",PORT);
})
