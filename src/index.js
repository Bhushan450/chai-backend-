// require('dotenv').config({path:'./env'})
import dotenv from "dotenv"

// import mongoose from"mongoose";
// import { DB_Name } from "./constants";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

connectDB()
.then(()=>{

    const err=app.on("err",(err)=>{
       console.log("application is not able to talk with database",err);
       throw err
       
    })
    const port=app.listen(process.env.PORT || 8000,()=>{
        console.log(` server is running at PORT: ${port}`);
        
    })
})
.catch((error)=>{
   console.log("MONGO db connection FAILED!!!",error);
   
})


/*
import express from "express"
const app= express()
;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        app.on("error",(error)=>{
            console.log("application is not able to talk to database",error);
            throw error   
        })

        app.listen(process.env.PORT,()=>{
            console.log(`app is listning on port ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.log("ERROR OCCURED",error);
        throw error
        
    }
})()

*/

//