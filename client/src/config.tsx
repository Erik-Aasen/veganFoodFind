let API;

if (process.env.NODE_ENV === "development") {
    API = "http://localhost:4000"
} 

if (process.env.NODE_ENV === 'production') {
    API = "https://vegan-food-find.herokuapp.com"
}

if (process.env.NODE_ENV === 'test') {
    API = "https://vegan-food-find-staging.herokuapp.com"
}

export default API;
