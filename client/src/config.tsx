if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line
    var API = "http://localhost:4000"

} else {
    // var API = "https://vegan-food-find.herokuapp.com"
    // eslint-disable-next-line
    var API = ""
}

export default API;
