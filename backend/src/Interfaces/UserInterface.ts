export interface UserInterface {
    isAdmin: boolean;
    _id: object;
    username: string;
    password?: string;
    posts?: PostInterface[];
  }

export interface PostInterface {
    _id: object;
    restaurant: string;
    city: string;
    meal: string;
    description: string;
    picture: string;
}