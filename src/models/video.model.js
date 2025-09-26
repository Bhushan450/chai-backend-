import mongoose,{Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const videoSchema= new Schema(
    {
       videoFile:{
        type: String,  // cloudinary
        required: [true,"video is required"]
       },
       thumbnail:{
        type: String,  
        required: [true,"thumbnail is required"]
       },
       title:{
        type: String,  
        required: [true,"title is required"]
       },
       description:{
        type: String,  
        required: [true,"description is required"],
       },
       duration:{
        type: Number,  
        required: true,
       },
       duration:{
        type: Number,  
        default: 0,
       },
       isPublished:{
        type: Boolean,
        default: true,
       },
       videoOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
       }
},{timestamps: true}

)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)