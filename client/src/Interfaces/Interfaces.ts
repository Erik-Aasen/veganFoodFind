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
    // picture: string;
    isApproved: boolean;
  }

export interface FormError {
    email: string;
    username: string;
    password: string;
}

export interface RegisterInterface {
    email: string,
    username: string,
    password: string,
    emailError: string,
    usernameError: string,
    passwordError: string
}

export interface CityMeal {
    city: string;
    meal: string;
  }