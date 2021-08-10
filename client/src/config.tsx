// var API="https://vegan-food-find.herokuapp.com";
var API = 'http://localhost:4000'

if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line
    var API = "http://localhost:4000"

} else if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line
    var API = "https://vegan-food-find.herokuapp.com"
    // const API = "/"
}

export default API;
