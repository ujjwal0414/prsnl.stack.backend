import { Schema } from "mongoose";

const vendorSchema = new Schema({
    vendorOwner:{
        type:String,
    },
    vendorEmail:{
        type:String
    },
    location:{
        
    }
})