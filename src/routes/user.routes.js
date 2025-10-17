import {Router} from "express"
import {registerUser , loginUser, logoutUser } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router= Router()

router.route("/register").post(  // "/register"=> is a route 
    upload.fields([          // upload.fields => accepts the array of images / files/ avatar -- Injecting middleware
        {
            name: "avatar",  // name of first file which we are taking from user is 'avatar' 
            maxCount:1,      // we accept only one avatar file 
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// secured routes
router.route("logout").post(verifyJWT,logoutUser)

export default router   