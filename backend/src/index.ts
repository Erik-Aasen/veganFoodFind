import mongoose, { Error } from 'mongoose';
import express, { Request, Response, NextFunction, response } from 'express';
import cors from 'cors';
import passport from 'passport';
import passportLocal from 'passport-local';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import { User, Post } from './User';
import dotenv from 'dotenv';
import { MongoInterface, UserSerialize, UserDeserialize, PostInterface, CapitalizeAndTrim, CityMeal } from './Interfaces/Interfaces';
import path from "path";
import { AuthRequest, RegisterRequest } from './definitionfile';
import { deleteFile, getFileStream, uploadFile } from './s3';
import crypto from 'crypto';
import jwt from 'jsonwebtoken'
// import rateLimit from 'express-rate-limit'
const rateLimit = require('express-rate-limit')
const nodemailer = require('nodemailer')

const LocalStrategy = passportLocal.Strategy;
dotenv.config();

mongoose.connect(`${process.env.PART1}${process.env.USERNAME}:${process.env.PASSWORD}${process.env.PART2}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err: Error) => {
  if (err) throw err;
  console.log("Connected to Mongo");
});

const apiLimiter = rateLimit({
  // windowMs: 15 * 60 * 1000, // 15 minutes
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});


// Middleware
const app = express();
// app.use(express.json());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(cors({
  origin: process.env.API_CLIENT, // "http://localhost:3000",
  credentials: true
}))

// app.set("trust proxy", 1); // turn this on to set rate limiting per IP address

app.use(
  session({
    secret: `${process.env.SESSIONSECRET}`,
    resave: true,
    saveUninitialized: true,
    // cookie: {
    // sameSite: "none",
    // secure: true,
    // maxAge: 1000 * 60 * 5 // 5 minutes
    // }
  })
);


app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/", apiLimiter);


//Passport
passport.use(new LocalStrategy((username: string, password: string, done) => {
  // User.findOne({ username: username }, (err: Error, user: MongoInterface) => {
  User.findOne({ username: username }, '_id username password isVerified').exec(function (err, user) {
    if (err) throw err;
    if (!user) return done(null, false, { message: 'username password incorrect' });
    if (user.isVerified === false) return done(null, false, { message: 'not verified' });
    bcrypt.compare(password, user.password, (err: Error, result: boolean) => {
      if (err) throw err;
      if (result === true) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'username password incorrect' });
      }
    })
  })
}));

passport.serializeUser((user: UserSerialize, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((_id, cb) => {
  User.findOne({ _id: _id }, '_id username isAdmin').exec(function (err, user) {
    const userInformation: UserDeserialize = {
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin
    };
    cb(err, userInformation);
  });
});

// MIDDLEWARE
const isAdministratorMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { user } = req;
  if (user) {
    User.findOne({ username: user.username }, (err: Error, user: MongoInterface) => {
      if (err) throw err;
      if (user.isAdmin) {
        next()
      } else {
        res.send("Sorry, only admins can perform this")
      }
    })
  } else {
    res.send("Sorry, you arent logged in")
  }
}

// GET ROUTES
app.get("/logout", (req: AuthRequest, res: Response) => {
  req.logout();
  res.send("logged out");
})

app.get("/user", (req: AuthRequest, res: Response) => {
  res.send(req.user);
})

async function getUserPictures(posts: PostInterface[]) {
  await Promise.all(posts.map(async (post) => {
    const picture = await getFileStream(post.pictureKey)
    post.pictureString = picture
    post.pictureKey = '' // don't send the pictureKey to client
  }))
  return posts
}

app.get("/getallusers", isAdministratorMiddleware, async (req, res) => {
  await User.find({}, '_id username isAdmin').exec(function (err, data) {
    res.send(data)
  })
})

app.get("/getmeals", async (req: AuthRequest, res: Response) => {
  await Post.find({ isApproved: true })
    .exec(function (err, posts) {
      if (err) throw err;
      const mealsAndCities = returnMealsAndCities(posts)
      res.send(mealsAndCities)
    })
})

app.get("/adminmeals", isAdministratorMiddleware, async (req: AuthRequest, res: Response) => {
  await Post.find({ isApproved: false })
    .exec(async (err: Error, posts) => {
      if (err) throw err;
      const postArray = await returnAllPosts(posts, false)
      res.send(postArray)
    })
})


app.get('/confirmation/:emailToken', async (req, res) => {
  try {
    const _id = await jwt.verify(req.params.emailToken, process.env.EMAIL_SECRET) as UserDeserialize;
    await User.updateOne({ _id: _id }, {
      '$set': {
        'isVerified': true
      },
      runValidators: true
    })
      .exec(async function (err) {
        if (err) throw err;
        res.redirect(process.env.API_CLIENT + `/api/login`)
      })
  } catch (err) {
    res.redirect(process.env.API_CLIENT)
  }
})

// // app.get("/test", async (req: AuthRequest, res: Response) => {
// // const readStream = await getFileStream('test')
// // res.send(readStream)
// // readStream.pipe(res) this is the command for file transfer
// // })

// //POST ROUTES
function looksLikeMail(str: string) {
  const lastAtPos = str.lastIndexOf('@');
  const lastDotPos = str.lastIndexOf('.');
  return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') === -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
}

const sendMail = async (_id: object, email: string) => {
  try {
    jwt.sign({
      _id: _id
    },
      process.env.EMAIL_SECRET
      , {
        expiresIn: '5m'
      },
      (err, emailToken) => {
        const url = process.env.API + `/confirmation/${emailToken}`
        transporter.sendMail({
          to: email,
          subject: 'Confirmation email testing',
          html: `<b>Confirmation link: </b><a href="${url}">${url}</a>`
        }, (error: any, info: any) => {
          if (error) {
            console.log(error);
          } else {
            // console.log(info);
          }
        })
      })
  }
  catch (err) {
    console.log(err)
  }
}

app.post('/api/register', async (req: RegisterRequest, res: Response) => {

  const { email, username, password } = req.body;

  if (
    !email ||
    !username ||
    !password ||
    typeof email !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    !looksLikeMail(email) ||
    username.length >= 20 ||
    password.length < 8 ||
    password.length > 20
  ) {
    res.send("Improper values")
    return;
  }

  User.findOne({ username }, async (err: Error, data: MongoInterface) => {
    if (err) throw err;
    if (data) {
      res.send('User already exists');
    }
    if (!data) {
      User.findOne({ email }, async (err: Error, data: MongoInterface) => {
        if (err) throw err;
        if (data.isVerified === false) {
          const hashedPassword = await bcrypt.hash(req.body.password, 10)
          const newUser = new User({
            email,
            username,
            password: hashedPassword
          });
          newUser.save((err, user) => {
            sendMail(user.id, email)
            res.send("registered")
          })
        } else {
          res.send('email already registered')
        }
      })
    }
  })
})

app.post('/api/resendconfirmation', (req: RegisterRequest, res) => {
  const { username } = req.body
  User.findOne({username: username}, '_id email')
  .exec((err: Error, data: MongoInterface) => {
    if (err) throw err;
    // console.log(data.email, data._id);
    sendMail(data._id, data.email)
    res.send('email sent')
  })
})

// app.post("/api/login", passport.authenticate("local", (error) => {
//   const loginError = error
//   console.log(loginError);
//   return loginError

// }), (req: AuthRequest, res: Response) => {
//   res.send("logged in");
//   // res.send(loginError)
// })

app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err) }
    if (!user) {
      return res.send(info.message)
    }
    req.logIn(user, (err) => {
      if (err) { return next(err) }
      return res.send('logged in')
    })
  })(req, res, next)
})


app.post("/deleteuser", isAdministratorMiddleware, async (req: AuthRequest, res: Response) => {
  const { _id } = req.body
  await User.findByIdAndDelete(_id)
    .catch((err: Error) => { throw err });
  res.send("user deleted")
});

function capitalizeAndTrim(post: CapitalizeAndTrim) {
  Object.keys(post).map(entry => post[entry] = capitalizeFirstLetter(post[entry].trim()))

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

app.post("/api/addmeal", async (req: AuthRequest, res: Response) => {
  const { user } = req;
  const { body } = req;
  const { restaurant, city, meal, description, pictureString } = body;

  let post: CapitalizeAndTrim = { restaurant, city, meal, description };
  capitalizeAndTrim(post);

  const key = crypto.randomBytes(20).toString('hex');

  if (user) {
    const newPost = new Post({
      username: user.username,
      isApproved: false,
      restaurant: post.restaurant,
      city: post.city,
      meal: post.meal,
      description: post.description,
      pictureKey: key,
      creationDate: new Date()
    })

    await newPost.save()
    // .catch(err => throw err);
    // .then();
    // console.log(key, pictureString);
    const result = await uploadFile(key, pictureString)
    res.send("meal added")
  }
})

async function returnAllPosts(posts: PostInterface[], isApproved: boolean) {

  await Promise.all(posts.map(async (post) => {
    if (isApproved === true) {
      if (post.isApproved === true) {
        const picture = await getFileStream(post.pictureKey)
        post.pictureKey = ''
        post.pictureString = picture

      }
    } else // isApproved === false 
    {
      if (post.isApproved === false) {
        const picture = await getFileStream(post.pictureKey)
        post.pictureKey = ''
        post.pictureString = picture

      }
    }
  }))
  return posts
}

function returnMealsAndCities(allposts: PostInterface[]) {
  let mealsAndCities: CityMeal[] = [];
  allposts.forEach((post) => {
    if (post.isApproved === true) {
      mealsAndCities.push({
        city: post.city,
        meal: post.meal
      })
    }
  })
  return mealsAndCities
}

async function returnMealSpecified(posts: PostInterface[], meal: string) {

  await Promise.all(posts.map(async (post) => {
    if (post.meal === meal) {
      const picture = await getFileStream(post.pictureKey)
      post.pictureKey = ''
      post.pictureString = picture

    }
  }))
  return posts
}

async function returnCitySpecified(posts: PostInterface[], city: string) {


  await Promise.all(posts.map(async (post) => {
    if (post.city === city) {
      const picture = await getFileStream(post.pictureKey)
      post.pictureKey = ''
      post.pictureString = picture

    }
  }))
  return posts;
}

async function returnCityMealSpecified(posts: PostInterface[], city: string, meal: string) {

  await Promise.all(posts.map(async (post) => {
    if (post.city === city) {
      if (post.meal === meal) {
        const picture = await getFileStream(post.pictureKey)
        post.pictureKey = ''
        post.pictureString = picture
      }
    }
  }))
  return posts;
}

app.post("/api/getmeals", async (req: AuthRequest, res) => {
  // console.log(Date.now());  

  const { city, meal, skip } = req.body;
  if (city === "All cities") {
    if (meal === "All meals") {
      await Post.find({ isApproved: true }, {}, { skip: skip, limit: 3 }).exec(async function (err, posts: PostInterface[]) {
        const postArray = await returnAllPosts(posts, true);
        res.send(postArray)
      })
    } else {
      await Post.find({ meal: meal, isApproved: true }, {}, { skip: skip, limit: 3 })
        .exec(async function (err, posts) {
          const postArray = await returnMealSpecified(posts, meal)
          res.send(postArray)
        })
    }
  } else {
    if (meal === "All meals") {
      await Post.find({ city: city, isApproved: true }, {}, { skip: skip, limit: 3 })
        .exec(async function (err, posts) {
          const postArray = await returnCitySpecified(posts, city)
          res.send(postArray)
        })
    } else {
      await Post.find({ city: city, meal: meal, isApproved: true }, {}, { skip: skip, limit: 3 })
        .exec(async function (err, posts) {
          const postArray = await returnCityMealSpecified(posts, city, meal)
          res.send(postArray)
        })
    }
  }
})

app.post("/api/usermeals", async (req: AuthRequest, res: Response) => {
  const { user } = req;
  // const { _id } = user;
  const { skip } = req.body;

  await Post.find({ username: user.username }, {}, { skip: skip, limit: 3 })
    .exec(async function (err, posts) {
      if (err) throw err;
      const postArray = await getUserPictures(posts)
      res.send(postArray)
    })
})

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICEPROVIDER,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

// app.post('/email', isAdministratorMiddleware, (req: AuthRequest, res) => {
//   const { _id } = req.user;
//   jwt.sign({
//     _id: _id
//   },
//     process.env.EMAIL_SECRET
//     , {
//       expiresIn: '5m'
//     },
//     (err, emailToken) => {
//       const url = process.env.API + `/confirmation/${emailToken}`
//       transporter.sendMail({
//         to: process.env.MAIL_USER2,
//         subject: 'Confirmation email testing',
//         html: `<b>Confirmation link: </b><a href="${url}">${url}</a>`
//       })
//     })
//   res.send('ok')
// })


// // PUT ROUTES
app.put("/api/editmeal", async (req: AuthRequest, res: Response) => {

  const { user } = req;
  const { _id, restaurant, city, meal,
    description, pictureString } = req.body;

  let post: CapitalizeAndTrim = { restaurant, city, meal, description };
  capitalizeAndTrim(post);

  const key = crypto.randomBytes(20).toString('hex');

  if (user) {
    await Post.findOne({ _id: _id })
      .exec(function (err, data: PostInterface) {
        if (err) throw err;
        const oldKey = data.pictureKey
        deleteFile(oldKey)
      })

    await Post.updateOne({ _id: _id }, {
      '$set': {
        'restaurant': post.restaurant,
        'city': post.city,
        'meal': post.meal,
        'description': post.description,
        'pictureKey': key,
        'isApproved': false,
        'updateDate': new Date()
      },
      runValidators: true
    })
      .exec(async function (err) {
        if (err) throw err;
        const result = await uploadFile(key, pictureString)
        res.send('meal updated')
      })
  }
})

app.put("/api/deletemeal", async (req: AuthRequest, res) => {
  const { user } = req;
  const { _id } = req.body;

  if (user) {

    Post.findOneAndDelete({ _id: _id })
      .exec(function (err, data: PostInterface) {
        if (err) throw err;
        const oldKey = data.pictureKey
        deleteFile(oldKey)
        res.send('meal deleted')
      })
  }
})

app.put("/adminmeals", async (req: AuthRequest, res) => {
  const { user } = req;
  const { _id } = req.body;

  if (user.isAdmin) {
    await Post.updateOne({ _id: _id }, {
      '$set': {
        'isApproved': true
      },
      runValidators: true
    })
      .exec(function (err) {
        if (err) throw err;
        res.send('meal approved')
      })
  }
})

app.use(express.static(path.join(__dirname, "../../../client/build/")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../client/build/", "index.html"));
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server Started");
})