import mongoose from "mongoose";
import { MongoInterface } from "./Interfaces/Interfaces";

const post = new mongoose.Schema({
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
    picture: {
        type: String
    },
    isApproved: {
        type: Boolean,
        default: false
    }
})

const user = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    posts: [post]
});

export default mongoose.model<MongoInterface>("User", user);

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



