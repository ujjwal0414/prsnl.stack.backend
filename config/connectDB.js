import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { logs } from "../utils/logger.js";
const connectDB = (async()=>{
    const DB_URI = process.env.DB_URI;
    try {
        logs.info("Connecting to DataBase");
        if(mongoose.connection.readyState >=1){
            await mongoose.disconnect();
        }
        const conn = await mongoose.connect(DB_URI);
        logs.info(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        
        throw error
    }
})
export {connectDB}