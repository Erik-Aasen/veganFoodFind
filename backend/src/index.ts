import mongoose, { Error } from 'mongoose';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import passport from 'passport';
import passportLocal from 'passport-local';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import User from './User';
import dotenv from 'dotenv';
import { MongoInterface, UserSerialize, UserDeserialize, PostInterface, CapitalizeAndTrim, CityMeal } from './Interfaces/Interfaces';
import path from "path";
import { AuthRequest } from './definitionfile';
import { getFileStream, uploadFile } from './s3';
import crypto from 'crypto';

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

// Middleware
const app = express();
// app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

// app.set("trust proxy", 1);

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

//Passport
passport.use(new LocalStrategy((username: string, password: string, done) => {
  // User.findOne({ username: username }, (err: Error, user: MongoInterface) => {
  User.findOne({ username: username }, '_id username password').exec(function (err, user) {
    if (err) throw err;
    if (!user) return done(null, false);
    bcrypt.compare(password, user.password, (err: Error, result: boolean) => {
      if (err) throw err;
      if (result === true) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
  })
}));

passport.serializeUser((user: UserSerialize, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((_id, cb) => {
  // User.findOne({ _id: _id }, (err: Error, user: MongoInterface) => {
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

app.get("/usermeals", async (req: AuthRequest, res: Response) => {
  const { user } = req;
  const { _id } = user;

  await User.findOne({ _id: _id }, '_id username posts').exec(function (err, data: MongoInterface) {
    if (err) throw err;
    const posts = data.posts;
    res.send(posts)
  })
})

app.get("/getallusers", isAdministratorMiddleware, async (req, res) => {
  await User.find({}, '_id username isAdmin').exec(function (err, data) {
    res.send(data)
  })
})

app.get("/getmeals", async (req: AuthRequest, res: Response) => {
  await User.find({
    posts: { $elemMatch: { isApproved: true } }
  }, 'posts').exec(function (err, allposts) {
    if (err) throw err;
    const mealsAndCities = returnMealsAndCities(allposts)
    res.send(mealsAndCities)
  })
})

app.get("/adminmeals", isAdministratorMiddleware, async (req: AuthRequest, res: Response) => {
  await User.find({
    posts: { $elemMatch: { isApproved: false } }
  }, (err: Error, data) => {
    if (err) throw err;
    const posts = returnUnapprovedPosts(data)
    res.send(posts)
  })
})

app.get("/test", async (req: AuthRequest, res: Response) => {
  const readStream = await getFileStream('test')
  // res.send(picture)
  // res.send(picture.pipe(res))
  // console.log(res.type);
  // console.log(readStream.pipe(res));

  // console.log(readStream);
  res.send(readStream)
  // console.log('ok');

  // readStream.pipe(res) this is the command for file transfer
  // console.log('ok2');

})

//POST ROUTES
app.post('/register', async (req: Request, res: Response) => {

  const { username, password } = req.body;
  if (
    !username ||
    !password ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 20 ||
    username.length >= 20
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
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username,
        password: hashedPassword
      });
      await newUser.save();
      res.send("registered")
    }
  })
})

app.post("/login", passport.authenticate("local"), (req: AuthRequest, res: Response) => {
  res.send("logged in");
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





app.post("/addmeal", async (req: AuthRequest, res: Response) => {
  const { user } = req;
  const { body } = req;
  const { restaurant, city, meal, description, picture } = body;

  let post: CapitalizeAndTrim = { restaurant, city, meal, description };
  capitalizeAndTrim(post);

  const key = crypto.randomBytes(20).toString('hex');

  if (user) {
    await User.updateOne(
      { _id: user._id },
      {
        $push: {
          posts: {
            "restaurant": post.restaurant,
            "city": post.city,
            "meal": post.meal,
            "description": post.description,
            "picture": key
          }
        }
      })
    // .catch(err => throw err);
    // .then();



    const result = await uploadFile(key, picture)

    res.send("meal added")



  }
})

function returnUnapprovedPosts(userPosts: MongoInterface[]) {

  let postArray: PostInterface[] = [];
  userPosts.forEach((user) => {
    user.posts.forEach((post) => {
      if (post.isApproved === false) {
        postArray.push(post)
      }
    })
  })

  return postArray;

}

function returnAllPosts(userPosts: MongoInterface[]) {

  let postArray: PostInterface[] = [];
  userPosts.forEach( (user) => {
    user.posts.forEach( (post) => {
      if (post.isApproved === true) {
        // try {
        // const readStream = getFileStream(post.picture)
        // const picture = await getFileStream(post.picture)
        // if (picture != '') {
        //   post.picture = picture
        // console.log(picture)
        // console.log('s3 api');

        // };

        // console.log(readStream.pipe());

        // } catch (error) {}
        // await console.log(1);

         postArray.push(post)
         console.log('array added');



      }
    })
  })
  postArray.forEach(post => {
    console.log(post._id);

  })
  console.log(postArray);
  
  return postArray;

}

function returnMealsAndCities(allposts: MongoInterface[]) {
  let mealsAndCities: CityMeal[] = [];
  allposts.forEach((user) => {
    user.posts.forEach((post) => {
      if (post.isApproved === true) {
        mealsAndCities.push({
          city: post.city,
          meal: post.meal
        })
      }
    })
  })
  return mealsAndCities
}

function returnMealSpecified(userPosts: MongoInterface[], meal: string) {

  let postArray: PostInterface[] = [];
  userPosts.forEach((user) => {
    user.posts.forEach((post) => {
      if (post.meal === meal) {
        postArray.push(post)
      }
    })
  })

  return postArray;

}

function returnCitySpecified(userPosts: MongoInterface[], city: string) {

  let postArray: PostInterface[] = [];
  userPosts.forEach((user) => {
    user.posts.forEach((post) => {
      if (post.city === city) {
        postArray.push(post)
      }
    })
  })

  return postArray;

}

function returnCityMealSpecified(userPosts: MongoInterface[], city: string, meal: string) {
  let postArray: PostInterface[] = [];
  userPosts.forEach((user) => {
    user.posts.forEach((post) => {
      if (post.city === city) {
        if (post.meal === meal) {
          postArray.push(post)
        }
      }
    })
  })

  return postArray;

}

app.post("/getmeals", async (req: AuthRequest, res) => {
  const { city, meal } = req.body;
  if (city === "All cities") {
    if (meal === "All meals") {
      await User.find({
        posts: { $elemMatch: { isApproved: true } }
      }, 'posts').exec(async function (err, userPosts) {
        const postArray = await returnAllPosts(userPosts);
        res.send(postArray)
      })
    } else {
      await User.find({
        posts: { $elemMatch: { meal: meal, isApproved: true } }
      }, 'posts').exec(function (err, userPosts) {
        const postArray = returnMealSpecified(userPosts, meal)
        res.send(postArray)
      })
    }
  } else {
    if (meal === "All meals") {
      await User.find({
        posts: { $elemMatch: { city: city, isApproved: true } }
      }, 'posts').exec(function (err, userPosts) {
        const postArray = returnCitySpecified(userPosts, city)
        res.send(postArray)
      })
    } else {
      await User.find({
        posts: { $elemMatch: { city: city, meal: meal, isApproved: true } }
      }, 'posts').exec(function (err, userPosts) {
        const postArray = returnCityMealSpecified(userPosts, city, meal)
        res.send(postArray)
      })
    }
  }
})

// PUT ROUTES
app.put("/addmeal", async (req: AuthRequest, res: Response) => {

  const { user } = req;
  const { _id, restaurant, city, meal, description, picture } = req.body;

  let post: CapitalizeAndTrim = { restaurant, city, meal, description };
  capitalizeAndTrim(post);

  if (user) {

    await User.updateOne({
      'posts._id': _id
    }, {
      '$set': {
        'posts.$.restaurant': post.restaurant,
        'posts.$.city': post.city,
        'posts.$.meal': post.meal,
        'posts.$.description': post.description,
        'posts.$.picture': picture,
        'posts.$.isApproved': false
      }
    }).exec(function (err) {
      if (err) throw err;
      res.send('meal updated')
    })
  }
})

app.put("/deletemeal", async (req: AuthRequest, res) => {
  const { user } = req;
  const { _id } = req.body;

  if (user) {
    await User.updateOne({
      'posts._id': _id
    }, {
      '$pull': { posts: { _id: _id } }
    }).exec(err => {
      if (err) throw err
      res.send('meal deleted')
    })
  }
})

app.put("/adminmeals", async (req: AuthRequest, res) => {
  const { user } = req;
  const { _id, isApproved } = req.body;

  if (user.isAdmin) {
    await User.updateOne({
      'posts._id': _id
    }, {
      '$set': {
        'posts.$.isApproved': isApproved
      }
    }).exec(function (err) {
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