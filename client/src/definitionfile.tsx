import { AxiosResponse } from "axios";
import { PostInterface, UserInterface } from "./Interfaces/Interfaces";

export interface PostResponse extends AxiosResponse {
    data: PostInterface[]
}

export interface UserResponse extends AxiosResponse {
    data: UserInterface[]
}