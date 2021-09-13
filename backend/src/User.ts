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