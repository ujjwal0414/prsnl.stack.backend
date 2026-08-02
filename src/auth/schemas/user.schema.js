import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
const userSchema = new Schema({
    userEmail:{
        type:String
    },
    password:{
        type:String
    }
},{
    timestamps:true
});
userSchema.pre("save",async function(){
    let user = this;
    if(user.isModified("password")){
        bcrypt.hash(user.password,3,(err,hash)=>{
            if(err){
                return error;
            }else{
                user.password = hash;
            }
        })
    }
})

const userModel = mongoose.model("user",userSchema)
export {userModel}