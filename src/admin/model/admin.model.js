import { Schema } from "mongoose";
import { required } from "zod/mini";
const notificationSchema = new Schema({
    from:{
        type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    priority:{
        type:String,
        enum:["high","medium","low","neutral"],
        default:"neutral"
    },
    content:{
        type:String,
        required:true,
        trim:true
    }
},{timestamps:true})
const AdminSchema = new Schema({
    adminEmail:{
        type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    phone: {
      type: String,
      required: true,
      match: [/^\+?[0-9]{7,15}$/, "Invalid phone number"],
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected","suspended"],
      default: "approved",
      index: true,
    },
    notifications:{
        type:[notificationSchema],
        default:[]
    }
})