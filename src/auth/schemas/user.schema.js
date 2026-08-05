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
const userModel = mongoose.model("user",userSchema)
export {userModel}