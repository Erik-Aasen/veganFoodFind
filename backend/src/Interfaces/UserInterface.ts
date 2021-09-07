export interface UserInterface {
    _id: object;
    username: string;
    isAdmin: boolean;
}

export interface DatabaseUserInterface {
    isAdmin: boolean;
    _id: object;
    username: string;
    password: string;
    posts: PostInterface[];
  }

export interface UserPostsInterface {
    _id: object;
    username: string;
    posts: PostInterface[]
}

export interface PostInterface {
    _id: object;
    restaurant: string;
    city: string;
    meal: string;
    description: string;
    picture: string;
}