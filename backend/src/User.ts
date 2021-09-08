import mongoose from "mongoose";
import { UserInterface } from "./Interfaces/UserInterface";

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

// const user = new mongoose.Schema<UserInterface>({
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

// export default mongoose.model<UserInterface>("User", user);
export default mongoose.model<UserInterface>("User", user);