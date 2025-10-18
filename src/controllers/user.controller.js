import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens= async (userId)=>{
    try {
       const user= await User.findById(userId)
       const accessToken=user.generateAccessToken()
       const refreshToken=user.generateRefreshToken()

       user.refreshToken= refreshToken   // add refreshToken to the user 
       await user.save({ validateBeforeSave: false})  // save refreshToken into database  // valBeforeSave : save without any validation 

       return {accessToken, refreshToken}
       
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating access and refresh token")
        
    }
}


const registerUser = asyncHandler(async (req,res)=>{
     /* Steps for register user in databse*/

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
    //  console.log(`email:${email}, username:${username}, password:${password}`);
    
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
    console.log(existedUser);

    if (existedUser) {
        throw new ApiError(409,"User with email or username already exists")
    }
    console.log(req.files);
    
    // check for images 
    const avatarLocalPath=req.files?.avatar[0]?.path;
    // const coverImageLocalPath=req.files?.coverImage[0]?.path; // checking for coverimageLocalPath but gives error if cover image will not uploaded 

    // checking for coverImageLocalPath (advanced way than uppar way )
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length> 0) {
        coverImageLocalPath=req.files.coverImage[0].path
    }

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
        new ApiResponse(200,createduser,"User Registered Succesfully!!!")  // IMP 
    )
})

const loginUser = asyncHandler(async(req, res)=>{

    /* Steps for logged in user */

    // took data from req.body (req.body-> data)
    // username / email based access
    // find the user if existed or not 
    // if existed then check password
    // access and refresh token
    // send cookie 
    
    // get data
    const {email,username,password}= req.body
    
    if (!email && !username) {  // depends on requirment we give username/email based access
        throw new ApiError(400,"username or email is required")
    }
    if (!password) {
        throw new ApiError(400,"passsword is required")  // by self 
    }
    
    // check for email or username whether existed in databse or not    
    const user=await User.findOne({  // User comes from databse 
        $or:[{email},{username}]   // $or is a ongodb operator 
    })
    
    if (!user) {
        throw new ApiError(404,"user does not exits!!")
    }
    
    const isPasswordValid=await user.isPasswordCorrect(password)  //here we pass the password to the isPasswordCorrect method which is in user model
      
    if (!isPasswordValid) {
    throw new ApiError(401,"Incorrect Password")
    } 

    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id)

    // remove this information from cookies 
    const loggedInUser=await User.findById(user._id).select("-password refreshToken")  

    // send cookies 
    const options={
        httpOnly: true,  
        secure: true,  // through this steps cookies cannot madifyable from frontend onlt can modifyable from server/backend
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)  // add cookie
    .cookie("refresToken",refreshToken,options)  // add cookie 
    .json( 
        new ApiResponse(
            200,
            {
                user:loggedInUser , accessToken, refreshToken
            },
            "user logged In successfully!!!"
        )
    )
})

// here we introduce new middleware of authentication : we need 'user': user._id access here 
const logoutUser= asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
         req.user._id,
         {
            $set:{                        // $set : mongoDB operator 
                refreshToken: undefined  // clear refreshToken from database 
            },
         },
         {
            new:true,
         }
    )

    const options={
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)  // clear / delete cookie
    .clearCookie("refreshToken",options) // clear / delete cookie  
    .json(new ApiResponse(200,{},"User logged Out!!"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}