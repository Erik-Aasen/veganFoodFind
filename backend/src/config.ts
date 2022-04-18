if (process.env.MODE === 'production' || process.env.MODE === 'staging') {
    // eslint-disable-next-line
    var API  = 'https://' + process.env.HEROKU_APP_NAME + '.herokuapp.com'
    var API_CLIENT  = 'https://' + process.env.HEROKU_APP_NAME + '.herokuapp.com'
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