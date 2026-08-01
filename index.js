import { configDotenv } from "dotenv";
configDotenv();
import {app} from "./app.js";
import { logs } from "./utils/logger.js";

app.listen(process.env.BACKEND_PORT,(err)=>{
    if(err){
        logs.error("Cant connect")
    }else{
        logs.info("connected")
    }
})