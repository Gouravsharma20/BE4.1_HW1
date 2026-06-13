const {initializeDatabase} = require("./db/db.connection.js")

const express = require("express")

const app = express()

app.use(express.json())

const fs = require("fs")

const Hotel = require("./model/HotelModel.js")
const { error } = require("console")

const jsonData = fs.readFileSync("./data/hotelData.json","utf-8")

app.get("/",(req,res)=>{
    res.json("welcome to my restraunt express app")
})
const hotelData = JSON.parse(jsonData)



// async function readHotels(){
//     await initializeDatabase()
//     try{
//         const allData = await Hotel.find()
//         return allData
//     } catch(err) {
//         console.log("Error loading data",err)
//     }
// }

// read hotels from api


// app.get("/restaurants", async(req,res)=>{
//     try {
//         const restros = await readHotels()
//         if (restros.length == 0 ) {
//             return res.status(404).json({error:"restraunts data not found"})
//         } else {
//             res.status(200).json({message:"restraunt data loaded successfully",restraunt:restros})
//         }
//     } catch (err) {
//         res.status(500).json({error:"An error occured while loading restraunt data"})
//     }
// })

// async function readHotelName(hotelName){
//     await initializeDatabase()
//     try {
//         const foundHotel = await Hotel.find({name:hotelName})
//         return foundHotel
//     } catch(err){
//         console.log(`Error finding ${hotelName} `,err)
//     }
// }

async function createRestraunt(newRestro) {
    await initializeDatabase()
    try {
        const restraunt = new Hotel(newRestro)
        const saveHotel = await restraunt.save()
        return saveHotel
    } catch(err){
        throw err
    }
}

app.post("/restaurants",async(req,res)=>{
    try {
        const addedRestro = await createRestraunt(req.body)
        return res.status(201).json({message:"restraunt added successfully",restraunt:addedRestro})

    } catch(err) {
        res.status(500).json({error:"an error occured while adding new restraunt data",details: err.message})
    }
})

const restrauntData = JSON.parse(jsonData)




// read hotels by restraunt name

// app.get("/restaurants/:restaurantName",async(req,res)=>{
//     try {
//         const restroName = await readHotelName(req.params.restaurantName)
//         if (!restroName){
//             return res.status(404).json({error:"restraunt name not found"})
//         } else {
//             res.status(200).json({message:"Restraunt found successfully",restrauntName:restroName})
//         }

//     } catch(err) {
//         res.status(500).json({error:"An error occured while loading restraunt name"})
//     }
    
// })


// async function findByPhoneNum(phoneNum){
//     await initializeDatabase()
//     try {
//         const foundRestro  = await Hotel.find({phoneNumber:phoneNum})
//         return foundRestro
//     } catch(err){
//         console.log(`No data found with phone number ${phoneNum}`)
//     }
// }

// find phone numebr using api

// app.get("/restaurants/directory/:phoneNumber",async(req,res)=>{
//     try {
//         const restro = await findByPhoneNum(req.params.phoneNumber)
//         if(!restro || restro.length === 0) {
//             return res.status(404).json({error:"an error occured while loading phone number"})
//         }
//         else {
//             return res.status(200).json({message:"data with phone number found successfully",data:restro})
//         }
//     } catch(err) {
//         return res.status(500).json({error:"an error occured while loading data"})
//     }
// })

// async function findByCuisineName(cuisines) {
//     await initializeDatabase()
//     try {
//         const foundCuisine = await Hotel.find({cuisine:cuisines})
//         return foundCuisine
//     } catch(err){
//         console.log(`unable to find ${cuisines}`)
//     }
// }

// app.get("/cuisine/:cuisineName",async(req,res)=>{
//     try {
//         const foundCuisine = await findByCuisineName(req.params.cuisineName)
//         if (foundCuisine.length === 0) {
//             return res.status(404).json({error:"cuisine not found"})
//         } else {
//             return res.status(200).json({message:"Cuisine found successfully",data:foundCuisine})
//         }
//     } catch(err){
//         return res.status(500).json({error:"an error occured while loading cuisine name"})
//     }
// })

// async function restrauntLoation(locate) {
//     await initializeDatabase()
//     try {
//         const foundLocation = await Hotel.find({location:locate})
//         return foundLocation
//     } catch (err) {
//         console.log("unable to find restraunt location")
//     }
// }

// app.get("/restaurants/location/:restaurantLocation",async (req,res)=>{
//     try {
//         const foundRestro = await restrauntLoation(req.params.restaurantLocation)
//         if (foundRestro.length === 0) {
//             return res.status(404).json({error:"location data not found",})
//         } else {
//             return res.status(200).json({message:"restraunt with location found successfully",restrauntData:foundRestro})
//         }
//     } catch (err) {
//         res.status(500).json({error:"unable to load restraunt location"})
//     }
// })

const PORT = 7726

app.listen(PORT,()=>{
    console.log(`App is running on Port ${PORT}`)
})


