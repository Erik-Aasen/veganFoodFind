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
    pictureKey: string;
    pictureString: string;
    isApproved: boolean;
  }

export interface FormError {
    username: string;
    password: string;
}

export interface RegisterInterface {
    username: string,
    password: string,
    usernameError: string,
    passwordError: string
}

export interface CityMeal {
    city: string;
    meal: string;
  }