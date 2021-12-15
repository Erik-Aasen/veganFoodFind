if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line
    let API = 'https://' + process.env.HEROKU_APP_NAME + '.herokuapp.com'
    
    // eslint-disable-next-line
    var API_CLIENT = 'https://' + process.env.HEROKU_APP_NAME + '.herokuapp.com'
    // var API = "https://vegan-food-find.herokuapp.com"
}

// if (process.env.NODE_ENV === 'test') {
//     // eslint-disable-next-line
//     let API = process.env.HEROKU_APP_NAME
//     // let API = "https://vegan-food-find-staging.herokuapp.com"
// }

if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line
    var API = "http://localhost:4000"
    // var API = process.env.HEROKU_APP_NAME
    // var API_CLIENT = process.env.API_CLIENT
}

else {
    // eslint-disable-next-line
    let API = ''
    
    // eslint-disable-next-line
    let API_CLIENT = ''
}

export {API, API_CLIENT};
// export API_CLIENT;