import {Router} from "express"
import registerUser from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

const router= Router()

router.route("/register").post(
    upload.fields([          // upload.fields => accepts the array of iamges / files/ avatar -- Injecting middleware
        {
            name: "avatar",  // name of first file which we are taking is 'avatar' 
            maxCount:1,      // we accept only one avatar file 
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser
)

export default router   