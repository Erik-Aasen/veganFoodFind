import mongoose from "mongoose";
import { MongoInterface, PostInterface } from "./Interfaces/Interfaces";

const post = new mongoose.Schema({
    username: {
        type: String
    },
    restaurant: {
        type: String
    },
    city: {
        type: String
    },
    meal: {
        type: String
    },
    description: {
        type: String
    },
    pictureKey: {
        type: String
    },
    pictureString: {
        type: String
    },
    isApproved: {
        type: Boolean,
        default: false
    }, 
    creationDate: {
        type: Object
    }, 
    updateDate: {
        type: Object
    }
})

const user = new mongoose.Schema({
    email: {
        type: String,
        // unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }, 
    isVerified: {
        type: Boolean,
        default: false
    },
    confirmationCode: {
        type: String
    },
    confirmationCodeDate: {
        type: Object
    }
});

const User = mongoose.model<MongoInterface>("User", user)
const Post = mongoose.model<PostInterface>("Post", post)

// export default ;
export { User, Post };

// Create new categories in user Schema:
    // isVerified default false
    // confirmation code
    // confirmation code date

// When user registers:
    // create confirmation code: jwt from email and jwtSecret (in env)
    // store confirmation code in db
    // send email with api/{email}/{confirmation code}

// When user clicks email link:
    // handle by api/:email/:confirmation code
    // if email exists, check if that user has that confirmation code within the expiration date
        // if so, mark user as verified
        // and delete confirmation code from db



