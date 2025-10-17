import {v2 as cloudinary} from "cloudinary"
import fs from "fs"  // fs=> file system 

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET, //'<your_api_secret>' // Click 'View API Keys' above to copy your API secret
    });

    const uploadOnCloudinary = async (localFilePath)=>{
       try {
         if (!localFilePath) {
            console.log("could not find localpath");
            return null
         }
         // upload the file on cloudinary 
         const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
         })
         
         
         // file has been uploaded succesfully
         // console.log("file is uploaded on cloudinary",response.url); 
         fs.unlinkSync(localFilePath)
         return response
         
       } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed 
        return null;
       }
    }

    export default uploadOnCloudinary
