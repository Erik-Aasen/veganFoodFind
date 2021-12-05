if (process.env.MODE === 'production') {
    // eslint-disable-next-line
    var API = "https://vegan-food-find.herokuapp.com"
    var clientAPI = "https://vegan-food-find.herokuapp.com"
}

if (process.env.MODE === 'test') {
    // eslint-disable-next-line
    var API = "https://vegan-food-find-staging.herokuapp.com"
    var clientAPI = "https://vegan-food-find-staging.herokuapp.com"
}

if (process.env.MODE === 'development') {
    // eslint-disable-next-line
    var API = "http://localhost:4000"
    var clientAPI = "http://localhost:3000"
}

else {
    // eslint-disable-next-line
    var API = ''
    var clientAPI = ''
}

export {API, clientAPI}