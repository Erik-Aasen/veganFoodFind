export interface UserSerialize {
  _id: object;
  username: string;
  password: string;
}

export interface UserDeserialize {
  isAdmin: boolean;
  _id: object;
  username: string;
}

export interface MongoInterface {
  isAdmin: boolean;
  _id: object;
  username: string;
  password: string;
  // posts: PostInterface[];
}

export interface PostInterface {
  username: string;
  _id: object;
  isApproved: boolean;
  restaurant: string;
  city: string;
  meal: string;
  description: string;
  pictureKey: string;
  pictureString: string;
  skip: number;
}

export interface CapitalizeAndTrim {
  [key: string]: string;
}

export interface CityMeal {
  city: string;
  meal: string;
}