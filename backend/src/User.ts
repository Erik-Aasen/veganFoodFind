import mongoose from "mongoose";

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

export default mongoose.model("User", user);