export interface UserInterface {
    _id: object;
    username: string;
    isAdmin: boolean;
}

export interface PostInterface {
    _id: object;
    restaurant: string;
    city: string;
    meal: string;
    description: string;
    picture: string;
    isApproved: boolean;
  }

export interface Error {
    error1?: string;
    error2?: string;
}