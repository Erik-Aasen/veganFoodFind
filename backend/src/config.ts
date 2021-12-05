if (process.env.MODE === 'production') {
    // eslint-disable-next-line
    var API = "https://vegan-food-find.herokuapp.com"
    var API_CLIENT = "https://vegan-food-find.herokuapp.com"
}

if (process.env.MODE === 'test') {
    // eslint-disable-next-line
    var API = "https://vegan-food-find-staging.herokuapp.com"
    var API_CLIENT = "https://vegan-food-find-staging.herokuapp.com"
}

if (process.env.MODE === 'development') {
    // eslint-disable-next-line
    var API = "http://localhost:4000"
    var API_CLIENT = "http://localhost:3000"
}

else {
    // eslint-disable-next-line
    var API = ''
    var API_CLIENT = ''
}

export {API, API_CLIENT}