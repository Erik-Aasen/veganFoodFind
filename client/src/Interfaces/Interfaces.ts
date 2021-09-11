export interface UserInterface {
    id: string;
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
  }