# Vegan Food Finder

App hosted on Heroku: https://vegan-food-finder.herokuapp.com

- A MERN full stack application that allows users to upload meals with images and provides an interactive search selector for finding meals by city

- Session based authentication using passport.js

- Authorization via React Context and React Router

- Node.js server with express framework and REST APIs

- MongoDB Atlas management and integration

- AWS S3 integration for image storing

- Types defined with Typescript in front and back end

- Image EXIF data stripped upon upload and users can choose image orientation, edit and delete their posts

- Types defined with Typescript in front and back end

- Mobile responsive design utilizing Bootstrap

- Email confirmation for user authorization with nodemailer.js

- Implemented custom admin middleware for content moderation through post approval

- Lazy loading posts feature

## Technologies used

- React w/ Context
- Typescript
- Bootstrap
- NodeJS
- Express
- Passport
- Bcrypt
- MongoDB
- Piexifjs
- Heroku

## Views

### Homepage

<img src="./pictures/meals.png" alt="meals" width="100%" />

### Add/View/Edit User Meals

<p float="left">
	<img src="./pictures/entermeal.png" alt="entermeal" width="32%"/>
	<img src="./pictures/mymeals.png" alt="mymeals" width="32%"/>
    <img src="./pictures/editmeal.png" alt="editmeal" width="32%"/>
</p>

## App File Structure

- [backend](backend)
	- [src](src)
		- [Interfaces](backend/src/Interfaces)
			- Contains a typescript file that defines object structures and key types
		- [index.ts](backend/src/index.ts)
		 	- Server file. Contains RESTful API and serves react build
		- [User.ts](backend/src/User.ts)
		 	- Mongoose schema definitions
- [client](client)
	- [public](client/public)
		- [index.html](client/public/index.html)
			- Root HTML file. Importantly, body div has id="root"
	- [src](client/src)
		- [Components](client/src/Components)
			- Reusable react components
		- [Interfaces](client/src/Interfaces)
			- Contains a typescript file that defines object structures and key types
		- [Pages](client/src/Pages)
			- Page level react components. Routed to with React BrowserRouter
		- [App.tsx](client/src/App.tsx)
			- Conditionally routes to components with BrowserRouter depending on global authentication state provided by Context
		- [index.tsx](client/src/index.tsx)
			- Uses ReactDOM to render App.tsx, wrapped in Context, to the "root" element in index.html
		- [main.css](client/src/main.css)
			- CSS file for front end styling. 
- [package.json](package.json)
	- Provides instructions for Heroku to install npm modules, build out the front and back end, and start the app

## MongoDB Atlas DB Structure
```
|-- veganFoodFind (database)
|   |-- users (collection)
|   |   |-- user (record)
|   |   |   |-- _id (ObjectId created by Mongo)
|   |   |   |-- isAdmin (false by default)
|   |   |   |-- isVerified (false by default)
|	|	|	|-- email (set by user on registration)
|   |   |   |-- username (set by user on registration)
|   |   |   |-- password (set by user on registration + salted + hashed)
|   |-- posts (collection)
|   |   |-- post (record)
|   |   |   |-- _id (ObjectId created by Mongo)
|   |   |   |-- restaurant (set by user)
|   |   |   |-- city (set by user)
|   |   |   |-- meal (set by user)
|   |   |   |-- description (set by user)
|   |   |   |-- pictureKey (set by user, base64 encoded string)
|   |   |   |-- orientation
