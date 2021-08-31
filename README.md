# Vegan Food Finder

App hosted on Heroku: https://vegan-food-find.herokuapp.com

- A MERN full stack application that allows users to upload meals with images and provides an interactive search selector for finding meals by city

- Implemented authorization with session based authentication using passport.js and stored with React Context

- MongoDB Atlas management and integration

- Image EXIF data stripped upon upload and users can choose image orientation, edit and delete their posts

- Mobile responsive design utilizing Bootstrap

## Technologies used

- React w/ Context
- Bootstrap
- NodeJS
- Express
- Passport
- Bcrypt
- MongoDB
- Piexifjs
- Heroku CI/CD

## Deployment

Continuous Deployment with Heroku.
- Project root package.json instructs Heroku to build out the front and back end.

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

```
|-- backend
|   |-- src
|   |   |-- Interfaces
|   |   |-- index.ts
|   |   |-- User.ts
|   |-- package.json
|   |-- tsconfig.json
|-- client
|   |-- public
|   |   |-- index.html
|   |-- src
|   |   |-- Components
|   |   |-- Interfaces
|   |   |-- Pages
|   |   |-- App.tsx
|   |   |-- config.tsx
|   |   |-- index.tsx
|   |   |-- main.css
|   |-- package.json
|   |-- tsconfig.json
|-- pictures
|-- .gitignore
|-- package.json
```

## MongoDB Atlas DB Structure
```
|-- veganFoodFind (database)
|   |-- users (collection)
|   |   |-- user (record)
|   |   |   |-- _id (ObjectId created by Mongo)
|   |   |   |-- isAdmin (false by default)
|   |   |   |-- username (set by user on registration)
|   |   |   |-- password (set by user on registration + salted + hashed)
|   |   |   |-- posts (Array)
|   |   |   |   |-- Object
|   |   |   |   |   |-- _id (ObjectId created by Mongo)
|   |   |   |   |   |-- restaurant (set by user)
|   |   |   |   |   |-- city (set by user)
|   |   |   |   |   |-- meal (set by user)
|   |   |   |   |   |-- description (set by user)
|   |   |   |   |   |-- picture (set by user, base64 encoded string)
```

## Future improvements
- Currently, the images are stored directly in MongoDB as base64 encoded strings  
&#8594; Better practice would be to store images in AWS S3 buckets and reference them in MongoDB

- Images should be compressed to save space and improve loading time

- Project is written in Typescript but most types need to be further defined instead of 'any'
	
- SEO, etc. Let me know what you think should be improved!
