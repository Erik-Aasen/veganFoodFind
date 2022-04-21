var API: string;
var API_CLIENT: string;

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    API  = 'https://' + process.env.HEROKU_APP_NAME + '.herokuapp.com'
    API_CLIENT  = API;
    console.log(API);
    
}

if (process.env.NODE_ENV === 'development') {
    API = process.env.API // "http://localhost:4000"
    API_CLIENT = process.env.API_CLIENT // "http://localhost:3000"
    console.log(API);
    
}

export { API, API_CLIENT }