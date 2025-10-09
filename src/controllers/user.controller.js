import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res)=>{
     /* steps for register user in databse*/

     // get user details from frontend - what data fields we required in model(username,email,pasword etc.)
     // validataion - not empty , right field etc.
     // check if user allready existed/registered : by username , email 
     // check for images , check for avatar 
     // upload them to cloudinary , avatar
     // create user object - create entry in DB 
     // remove password and refreshtoken field from response 
     // check for user creation 
     // return response  

     // get user details
     const {username,fullName,email,password}=req.body  // Destructure 
     console.log(`email:${email}, username:${username}, password:${password}`);
    
     // we can validate all fileds like this using "if(){}" but there is another better way to validate fields
    //  if(fullName===""){
    //     throw new ApiError(400,"full is required")  // 400 is a status code 
    //  }   
    
    // validate data 
    if (
        [username,fullName,email,password].some((allFields)=> allFields?.trim() ==="")  // .some => returns 'True' if anyone field is empty
    ) {
        throw new ApiError(400,"all fields are required")
    }

    if(
        !email.includes("@")
    ) {
        throw new ApiError(400,"Your email should consists of '@' symbol")
        
    }
 
    // check for user already existed or not in database
    const existedUser= await User.findOne({  
        $or:[{ username },{ email }]   //check if user existed with this username/email and returns 'True' is already existed
    })
    //console.log(existedUser);

    if (existedUser) {
        throw new ApiError(409,"User with email or username already exists")
    }

    // check for iamges 
    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;

    // check whether AvatarLocalPath is available or not 
    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is required") 
    }

    // upload images on cloudinary 
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400,"Avatar file is required") 
    }

    // create User object  
    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",  // ? check for the coverImage is available or not 
        email,
        password,
        username:username.toLowerCase(),
    })

    // here we checks for user creation and remove password and refreshtoken 
    const createduser=await User.findById(user._id).select(   
        "-password -refreshToken"      // remove password and refreshtoken from response 
    )                                  // '-' removes that fields from response 

    // check user created or not 
    if (!createduser) {
        throw new ApiError(500,"something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200,createduser,"User Registered Succesfully!!!")
    )
})

export default registerUser