const mongoose = require("mongoose")


const HotelModel = new mongoose.Schema({
    name:String,
    category:String,
    location:String,
    rating:Number,
    reviews:{
        type:[String],
        default:[]
    },
    website:String,
    phoneNumber:String,
    checkInTime:String,
    checkOutTime:String,
    amenities:[String],
    priceRange:{
        type:String,
        enum:["$ (0-10)","$$ (11-30)","$$$ (31-60)","$$$$ (61+)"]
    },
    reservationsNeeded:Boolean,
    isParkingAvailable:Boolean,
    isWifiAvailable:Boolean,
    isPoolAvailable:Boolean,
    isSpaAvailable:Boolean,
    isRestaurantAvailable:Boolean,
    photos:[String]
})

const HotelSchema = mongoose.model("Hotel",HotelModel)

module.exports = HotelSchema