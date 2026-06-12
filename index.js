const {initializeDatabase} = require("./db/db.connection.js")

const express = require("express")

const app = express()

const fs = require("fs")

const Hotel = require("./model/HotelModel.js")
const { error } = require("console")

const jsonData = fs.readFileSync("./data/hotelData.json","utf-8")

app.get("/",(req,res)=>{
    res.json("welcome to my restraunt express app")
})



const newHotel1 = {
  name: "Lake View",
  category: "Mid-Range",
  location: "124 Main Street, Anytown",
  rating: 3.2,
  reviews: [],
  website: "https://lake-view-example.com",
  phoneNumber: "+1234555890",
  checkInTime: "2:00 PM",
  checkOutTime: "12:00 PM",
  amenities: ["Laundry", "Boating"],
  priceRange: "$$$ (31-60)",
  reservationsNeeded: true,
  isParkingAvailable: false,
  isWifiAvailable: true,
  isPoolAvailable: false,
  isSpaAvailable: false,
  isRestaurantAvailable: false,
  cuisine: ["Middle Eastern", "French"],
  photos: ["https://example.com/hotel1-photo1.jpg", "https://example.com/hotel1-photo2.jpg"],
};



const newHotel2 = {
  name: "Sunset Resort",
  category: "Resort",
  location: "12 Main Road, Anytown",
  rating: 4.0,
  reviews: [],
  website: "https://sunset-example.com",
  phoneNumber: "+1299655890",
  checkInTime: "2:00 PM",
  checkOutTime: "11:00 AM",
  amenities: ["Room Service", "Horse riding", "Boating", "Kids Play Area", "Bar"],
  priceRange: "$$$$ (61+)",
  reservationsNeeded: true,
  isParkingAvailable: true,
  isWifiAvailable: true,
  isPoolAvailable: true,
  isSpaAvailable: true,
  isRestaurantAvailable: true,
  cuisine: ["Middle Eastern", "French"],
  photos: ["https://example.com/hotel2-photo1.jpg", "https://example.com/hotel2-photo2.jpg"],
};



const hotelData = JSON.parse(jsonData)

async function seedData(){
    try{
        for (const hotel of hotelData) {
            const newHotel = new Hotel(hotel);
            await newHotel.save();
            console.log("Data saved successfully")
        }
    } catch(err) {
        console.log("Error loading data",err)
    }
}

async function addData(newHotel){
    await initializeDatabase()
    try {
        const addHotel = new Hotel(newHotel)
        const saveHotel = await addHotel.save()
        console.log("New data saved successfully")

    } catch (err) {
        console.log("Error loading data",err)
    }
}

async function readHotels(){
    await initializeDatabase()
    try{
        const allData = await Hotel.find()
        return allData
    } catch(err) {
        console.log("Error loading data",err)
    }
}

// read hotels from api


app.get("/restaurants", async(req,res)=>{
    try {
        const restros = await readHotels()
        if (restros.length == 0 ) {
            return res.status(404).json({error:"restraunts data not found"})
        } else {
            res.status(200).json({message:"restraunt data loaded successfully",restraunt:restros})
        }
    } catch (err) {
        res.status(500).json({error:"An error occured while loading restraunt data"})
    }
})


async function readHotelName(hotelName){
    await initializeDatabase()
    try {
        const foundHotel = await Hotel.find({name:hotelName})
        return foundHotel
    } catch(err){
        console.log(`Error finding ${hotelName} `,err)
    }
}

// read hotels by restraunt name

app.get("/restaurants/:restaurantName",async(req,res)=>{
    try {
        const restroName = await readHotelName(req.params.restaurantName)
        if (!restroName){
            return res.status(404).json({error:"restraunt name not found"})
        } else {
            res.status(200).json({message:"Restraunt found successfully",restrauntName:restroName})
        }

    } catch(err) {
        res.status(500).json({error:"An error occured while loading restraunt name"})
    }
    
})

async function ifParkingAvailable(){
    await initializeDatabase()
    try {
        const ifparking = await Hotel.find({isParkingAvailable:true})
    console.log("Hotels with parking available :",ifparking)

    } catch {
        console.log("Error finding available parking data")
    }
    
}

async function availableRestraunt(){
    initializeDatabase()
    try {
        const availabelRestro = Hotel.find({isRestaurantAvailable: true})
        console.log("list of available Restraunts:",availabelRestro)

    } catch(err){
        console.log("Error loading data",err)
    }
}

async function findCategory(category){
    await initializeDatabase()

    try {
        const categoryHotel = await Hotel.find({category:category})
        console.log(`${category} restraunts : `,categoryHotel)

    } catch(err) {
        console.log(`Error finding ${category} hotels`)
    }
}

async function restrauntRange(restroRange){
    await initializeDatabase()
    try {
        const foundRange = await Hotel.find({priceRange:restroRange})
        console.log(`Restraunt fount with range ${restrauntRange} : `,foundRange)


    } catch (err) {
        console.log(`Error loading data of range ${restrauntRange}`)
    }
}

async function ratedRestro(rating){
    await initializeDatabase()
    try {
        const foundRatingData = await Hotel.find({rating:rating})
        console.log(`Restraunt with rating ${rating} : `,foundRatingData)

    } catch (err) {
        console.log(`No data found with rating ${rating}`)
    }
}


async function findByPhoneNum(phoneNum){
    await initializeDatabase()
    try {
        const foundRestro  = await Hotel.find({phoneNumber:phoneNum})
        return foundRestro
    } catch(err){
        console.log(`No data found with phone number ${phoneNum}`)
    }
}

// find phone numebr using api

app.get("/restaurants/directory/:phoneNumber",async(req,res)=>{
    try {
        const restro = await findByPhoneNum(req.params.phoneNumber)
        if(!restro || restro.length === 0) {
            return res.status(404).json({error:"an error occured while loading phone number"})
        }
        else {
            return res.status(200).json({message:"data with phone number found successfully",data:restro})
        }
    } catch(err) {
        return res.status(500).json({error:"an error occured while loading data"})
    }
})

async function findByCuisineName(cuisines) {
    await initializeDatabase()
    try {
        const foundCuisine = await Hotel.find({cuisine:cuisines})
        return foundCuisine
    } catch(err){
        console.log(`unable to find ${cuisines}`)
    }
}

app.get("/restaurants/cuisine/:cuisineName",async(req,res)=>{
    try {
        const foundCuisine = await findByCuisineName(req.params.cuisineName)
        if (foundCuisine.length === 0) {
            return res.status(404).json({error:"cuisine not found"})
        } else {
            return res.status(200).json({message:"Cuisine found successfully",data:foundCuisine})
        }
    } catch(err){
        return res.status(500).json({error:"an error occured while loading cuisine name"})
    }
})

async function restrauntLoation(locate) {
    try {
        const foundLocation = await Hotel.find({location:locate})
        return foundLocation
    } catch (err) {
        console.log("unable to find restraunt location")
    }
}

app.get("/restaurants/location/:restaurantLocation",async (req,res)=>{
    try {
        const foundRestro = await restrauntLoation(req.params.restaurantLocation)
        if (foundRestro.length === 0) {
            return res.status(404).json({error:"location data not found",})
        } else {
            return res.send(200).json({message:"restraunt with location found successfully",restrauntData:foundRestro})
        }
    } catch (err) {
        res.status(500).json({error:"unable to load restraunt location"})
    }
})


//[BE2.3_CW]

//update Many

async function updateMovie(movieId,dataToUpdate) {
    await initializeDatabase()
    try {
        const hotelMovie = await Hotel.findByIdAndUpdate(movieId,dataToUpdate,{new:true})
        console.log(`${dataToUpdate} updated successfully as ${hotelMovie}`)
    } catch (err){
        console.log("error loading data ",err)
    }
}

// updateMovie("6a1ed7aafdd57125f93b26ae",{rating:3.2})

//update one

async function updateMovieDetails(movieTitle,valueToUpdate){
    await initializeDatabase()
    try {
        const changingData = await Hotel.findOneAndUpdate({name:movieTitle},valueToUpdate,{new:true})
        console.log(`${movieTitle} updated successfully : `,changingData)

    } catch(err) {
        console.log(`Error changing movieTitle [${movieTitle}]`,err)
    }
}


// updateMovieDetails("The Grand Meridian",{rating:4.44})



// BE2.3_HW2


async function updateHotelName(hotelId,hotelName){
    await initializeDatabase()
    try {
        const updatedData = await Hotel.findByIdAndUpdate(hotelId,hotelName,{new:true})
        console.log(`${hotelName} updated successfully as :`,updatedData)

    } catch(err) {
        console.log(`Error updating hotel name `,err)
    }
}

// updateHotelName("6a1ed7aafdd57125f93b26ae",{name:"new Hotel"})

async function updateHotelData(hotelName,valueToUpdate){
    await initializeDatabase()
    try {
        const updatedData = await Hotel.findOneAndUpdate({name:hotelName},valueToUpdate,{new:true})
        console.log(`${hotelName} updated successfully`,updatedData)

    } catch (err) {
        console.log(`unable to find hotel ${hotelName} `,err)
    }
}



// updateHotelData("Lake View",{rating:"4.2"})






async function updatePhoneNumber(phoneNumber,updatedPhoneNumber){
    await initializeDatabase()
    try {
        const updateNumber = await Hotel.findOneAndUpdate({phoneNumber:updatedPhoneNumber})
        console.log("phone number updated successfully as ",updatedPhoneNumber)

    } catch(err) {
        console.log("Error updating phone number : ",err)
    }
}

// updatePhoneNumber("+1299655890","+1997687392")


async function deleteHotel(hotelId) {
    await initializeDatabase()
    try {
        const deleteMovie = await Hotel.findByIdAndDelete(hotelId)
        console.log("Hotel data deleted successfully",deleteMovie)

    } catch(err){
        console.log("An error occured while deleting hotel: ",err)
    }
}

//  deleteHotel("6a1ed7aafdd57125f93b26ae")

async function deleteHotelByData(hotelTitle){
    await initializeDatabase()
    try {
        const deleteMovie = await Hotel.findOneAndDelete({name:hotelTitle})
        console.log(`${hotelTitle} deleted successfully`,deleteHotel)

    } catch(err) {
        console.log("Error loading data",err)
    }
}

// deleteHotelByData("Azure Bay Resort")

// deleteHotelById

async function deleteHotelById(hotelId){
    await initializeDatabase()
    try {
        const deleteData = await Hotel.findByIdAndDelete(hotelId)
        console.log(`Hotel data with ${hotelId} deleted successfully`)
    } catch(err) {
        console.log("Error deleteing hotel data by id ",err)
    }
}

// deleteHotelById("6a1ed7abfdd57125f93b26b1")


// deleteHotelByPhoneNumber

async function deleteHotelByPhoneNumber(phoneNum) {
    await initializeDatabase()
    try {
        const deleteData = await Hotel.findOneAndDelete({phoneNumber:phoneNum})
        console.log(`data with ${phoneNum} deleted successfully : `,deleteData)

    } catch(err) {
        console.log("Error loading data : ",err)
    }

    try {

    } catch(err) {
        console.log("Error deleteing data with phone Number : ",err)
    }
}

 //deleteHotelByPhoneNumber("+918887776655")




//seedData()

// solution 1

 //addData(newHotel1)

// solution 2

 //addData(newHotel2)


// solution 3

 //readHotels()


// solution 4

 //readHotelName('The Grand Meridian')

// solution 5

 //ifParkingAvailable()

// solution 6

 //availableRestraunt()

//solution 7

 //findCategory("Mid-Range")

//solution 8

 //restrauntRange("$$$$ (61+)")

//solution 9

 //ratedRestro(4)

//solution 10

 //findByPhoneNum("+1299655890")

 //console.log(hotelData)

const PORT = 7794

app.listen(PORT,()=>{
    console.log(`App is running on Port ${PORT}`)
})


