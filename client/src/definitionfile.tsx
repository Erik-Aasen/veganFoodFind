import { AxiosResponse } from "axios";
import { CityMeal, PostInterface, UserInterface } from "./Interfaces/Interfaces";

export interface PostResponse extends AxiosResponse {
    data: PostInterface[]
}

export interface UserResponse extends AxiosResponse {
    data: UserInterface[]
}

export interface CityMealResponse extends AxiosResponse {
    data: CityMeal[]
}