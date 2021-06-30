const path = require('path')
const express = require('express')
const cors = require('cors')

const dotenv = require('dotenv')
const morgan = require('morgan')
const mongoose = require('mongoose')
const passport = require('passport')
const ConnectDB = require('./config/db')
const session = require('express-session');
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')

const app = express();
app.disable('x-powered-by');

dotenv.config({path: './config/dot.env'});

// instinct of passport for entire server
require('./config/google')(passport)
require('./config/login')(passport)

ConnectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))

// logging

  app.use(morgan('dev'))

// app.set('trust proxy', 1); // // trust first proxy
app.use(
  session({
    cookie:{
      secure: true,
      maxAge: 60000
         },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store:  MongoStore.create({
      mongoUrl: process.env.MONGO_URI // store is used to store user session so that if user visit page again then user will be loggedIn
  })
  })
);
app.use(function(req,res,next){
  if(!req.session){
      return next(new Error('Oh no')) //handle error
  }
  next() //otherwise continue
  });

// Passport middleware
app.use(cookieParser('secretcode'));
app.use(passport.initialize());
app.use(passport.session());



app.use('/auth', require('./routes/Reset_Password'))
app.use('/user', require('./routes/Login_User'))

const PORT = process.env.PORT || 4444
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
})