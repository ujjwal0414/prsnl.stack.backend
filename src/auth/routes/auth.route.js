import express from "express";
const authRouter = express.Router();
authRouter.post("/login",(req,resp)=>{
    resp.send("login api")
})
export {authRouter}