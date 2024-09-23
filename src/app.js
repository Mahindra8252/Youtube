import express from "express"
import cors from "cors";
import cookieparser from "cookie-parser"  //to access cookes from server

const app=express()

app.use(cors({
      origin: process.env.CORS_ORIGIN,
      credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieparser())


//routes

import userRouter from './routes/user.routes.js';

//routes decliration
app.use("/api/v1/users",userRouter)

// http://localhost:8000/api/v1/users/register

export{app}