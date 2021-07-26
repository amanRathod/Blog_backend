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
// app.disable('x-powered-by');

dotenv.config({path: './config/dot.env'});

// instinct of passport for entire server
require('./config/google')(passport)
require('./config/login')(passport)
require('./config/github')(passport)

ConnectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))
app.use(morgan('dev'))


app.use( (req, res, next) => {  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH'); 
  res.header('Access-Control-Allow-Headers', '*');  
  res.header('Access-Control-Allow-Credentials', true);  
  next();
});


// app.set('trust proxy', 1); // // trust first proxy
app.use(
  session({
    cookie:{
      secure: true,
      maxAge: 24*60*60*1000
         },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store:  MongoStore.create({
      mongoUrl: process.env.MONGO_URI // store is used to store user session so that if user visit page again then user will be loggedIn
  })
  })
);

// Passport middleware
app.use(cookieParser('secretcode'));
app.use(passport.initialize());
app.use(passport.session());

app.use('/public',express.static('public'));

app.use('/reset', require('./routes/Reset_Password'))
app.use('/user', require('./routes/Login_User'))
app.use('/auth', require('./routes/Google_User'));
app.use('/getData', require('./routes/SendDataToClient'))
app.use('/postData', require('./routes/post_toClient'))
app.use('/putData', require('./routes/put_toClient'))
app.use('/deleteData', require('./routes/delete_toClient'))

const PORT = process.env.PORT || 4444
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
})