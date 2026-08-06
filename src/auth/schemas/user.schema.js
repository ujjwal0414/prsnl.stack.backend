import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const sessionSchema = new Schema({
    refreshToken:String,
    os:{
        name:String,
        version:String
    }
})
const userSchema = new Schema({
    userEmail:{
        type:String
    },
    password:{
        type:String
    },
    role:{
        type:String,
    },
    phone:{
        type:String
    },
    sessions:[sessionSchema]
},{
    timestamps:true
});
userSchema.pre("save",async function(){
  
    if(this.isModified("password")){
        try {
            const hash = await bcrypt.hash(this.password,10);
            this.password = hash;
            
        } catch (error) {
            return
        }
    }else{
        
    }
})
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        userEmail:this.userEmail
    },process.env.ACCESS_TOKEN_KEY,{
        expiresIn:"1h"
    })
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        userEmail:this.userEmail
    },process.env.REFRESH_TOKEN_KEY,{
        expiresIn:"1d"
    })
}
const userModel = mongoose.model("user",userSchema)
export {userModel}