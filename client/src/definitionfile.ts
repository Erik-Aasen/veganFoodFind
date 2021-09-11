import { AxiosResponse } from "axios";
import { PostInterface } from "./Interfaces/Interfaces";

export interface PostResponse extends AxiosResponse {
    data: PostInterface[]
}