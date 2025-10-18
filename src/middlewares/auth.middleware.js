import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

// this is middleware for authentication 
// this middleware only / just check if there is 'user exists or not '

export const verifyJWT = asyncHandler(async(req, _,next)=>{  // verifyJWT => we are going to verify the JWT (accessToken &refreshToken)

    try {
        const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")  // 'req'has the access of coookies 
          // header contains info like content type , sender details etc(chatgpt).
          // authorisation header: used to send credentials or tokens from client to server to prove that user have permission(authorisation) to access protected route/api
          // Bearer keyword : chatgpt
           
        if (!token) {
            throw new ApiError(401,"Unauthorized request ")
        } 
    
       const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
       const user= await User.findById(decodedToken?._id).select("-password -refreshToken")
    
       if (!user) {
        throw new ApiError(401,"Invalid Access Token")
       }
    
       req.user=user;  // watch this again 
       next()
    
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token")
    }

})