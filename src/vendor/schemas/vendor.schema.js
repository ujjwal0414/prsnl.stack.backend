import { Schema } from "mongoose";
const servicesSchema = new Schema({
    type:String,
    address:String,
    city:String,
    state:String,
    zip:String,
    timings:[{
        day:String,
        timeDuration:String
    }],
    servicePricePerHour:String,
    
})
const vendorSchema = new Schema({
    vendorOwner:{
        type:String,
    },
    vendorEmail:{
        type:String
    },
    contact:{
        type:String
    },
    alternativeContact:String,
    services:[servicesSchema],
    status:{
        type:String,
        enum:["Online","Offline","Busy","Out of Office"],
        default:"Online"
    }
})