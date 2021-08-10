let API="/";

if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line
    const API = "http://localhost:4000"

} else if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line
    const API = "https://vegan-food-find.herokuapp.com"
    // const API = "/"
}

export default API;
