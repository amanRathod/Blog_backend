const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const ConnectDB = require('./config/db');

const app = express();
// app.disable('x-powered-by');

dotenv.config();

// pooling connection for monogoDB connection pooling of pool size is 10

ConnectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(morgan('dev'));

// disable console log for production mode
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
}

app.use('/', require('./routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
