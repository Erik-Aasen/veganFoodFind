if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line
    var API = "http://localhost:4000"
} 

if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line
    var API = "https://vegan-food-find.herokuapp.com"
    // var API = ""
}

    // eslint-disable-next-line
if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line
    var API = "https://vegan-food-find-staging.herokuapp.com"
}

else {
    var API = '';
}

export default API;