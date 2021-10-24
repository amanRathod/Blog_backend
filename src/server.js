const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const ConnectDB = require('./config/db');

const app = express();
// app.disable('x-powered-by');

dotenv.config();
ConnectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(morgan('dev'));

app.use('/', require('./routes'));

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
