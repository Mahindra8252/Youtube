import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {user} from "../models/use.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser=asyncHandler(async(req,res)=>{
   //   res.status(200).json({
   //      Message:"youtube user page by mahindra"
   //   })

   // get user detail from frontend
   // validation- not empty
   // chek if user already exist-by email,by userid
   // ckeck fro images ,check for avatar
   // uplode them to cloudinary, avater
   // create user object -create entry in db
   // remove pasword and refresh token fild from response
   // check for user creation
   // return res

   const{fullName,email,username,password}=req.body
       console.log("email:",email);
       console.log("password:",password);

       //validation

       if(
         [fullName,email,username,password].some((field)=>field?.trim()=="")
       ){
         throw new ApiError(400,"All field are required")
       }
       
       //check dublicate user, email
       const existedUser= User.findOne({
         $or:[{username},{email}]
       })
       
       if(existedUser){
         throw new ApiError(400,"user name is already exist !!")
       }

       const avatarLocalPath= req.files?.avatar[0]?.path;
       const coverImageLocalPath=req.files?.coverImage[0]?.path;

       if(!avatarLocalPath){
         throw new ApiError(400,"Avatarlocalpath file is requird")
       }

       //avarerLocalpath need to present

       const avatar=await uploadOnCloudinary(avatarLocalPath);
       const coverImage=await uploadOnCloudinary(coverImageLocalPath);

       if(!avatar){
         throw new ApiError(400,"Avatar file is requird")
       }
       const user= await User.create({
         fullName,
         avatar:avatar.url,
         coverImage:coverImage?.url || "",
         email,
         password,
         username:username.toLowerCase()
       })
       
      const createdUser= await User.findById(user._id).select(
         "-password -refreshToken"
      )
      
      if(!createdUser){
         throw new ApiError(500,"somithing went wrong while registering user")
      }

      //api res

      return res.status(201).json(
         new ApiResponse(200,createdUser,"User register Successfully")
      )

})

export {registerUser}