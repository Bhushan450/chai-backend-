import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app=express()

app.use(cors({       // .use() using for midddlewares & configuration 
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))    

app.use(express.json({limit:"20kb"}))  // when data comes from 'FORM'
app.use(express.urlencoded({extended: true,limit:"20kb"})) // when data comes from 'URL'
app.use(express.static("public"))  // for storing photos etc. into our server 
app.use(cookieParser())

//routes import 
import userRouter from "./routes/user.routes.js"

// routes declaration 
app.use("/api/v1/users",userRouter)

// https://localhost:8000/api/v1/users/register

export default app

