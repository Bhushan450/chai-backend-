import mongoose,{Schema} from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema =new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
    },
        fullName:{
            type: String,   
            required: true,
            trim: true,
            index: true,
    },
        avatar:{
            type: String,  // cloudinary url
            required: true,
    },
        covername:{
            type: String,
    },
        watchHistory:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Video",
            }
        ],
        password:{
            type: String,
            required: [true,"password is required"],
        },
        refreshToken:{
            type: String,   
        },

},{timestamps: true}
)

userSchema.pre("save",async function(next){   // pre is a hook(middleware)
    if(!this.isModified("password")) return next();
   this.password = bcrypt.hash(this.password,10)
   next()
})                         // password encryption and checking is done by 'bcrypt'

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password)

}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
           _id: this._id,
           email:this.email,
           username:tjis.userSchema,    // all this is comes from database 
           fullName:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
           _id: this._id,   // comes from database  
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User",userSchema)