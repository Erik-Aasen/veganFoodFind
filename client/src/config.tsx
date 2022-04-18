if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line
    var API = 'https://' + process.env.HEROKU_APP_NAME + '.herokuapp.com'
}

if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line
    var API = "http://localhost:4000"
}

else {
    // eslint-disable-next-line
    var API = ''
}

export { API }