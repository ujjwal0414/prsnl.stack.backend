import mongoose, { Schema } from "mongoose";

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


const userModel = mongoose.model("user",userSchema)
export {userModel}