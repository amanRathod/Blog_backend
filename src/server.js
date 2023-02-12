// eslint-disable-next-line strict
'use strict';
require('newrelic');
const cluster = require('cluster');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const ConnectDB = require('./config/db');

const OS = require('os');
const numCpu = OS.cpus().length;
process.env.UV_THREADPOOL_SIZE = numCpu;

const app = express();

dotenv.config();

ConnectDB();

// disabling socket pooling to remove the limit of 5 sockets per host
// app.globalAgent.maxSockets = 25;

// middleware
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(morgan());

// disable console log for production mode
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('common', {
    skip: function(req, res) { return res.statusCode < 400; },
    stream: process.stderr,
  }));
  console.log = () => {};
}

// gulp task to optimize the images from client side to server side
// gulp.task('images', () => {
//   gulp.src('src/images/*')
//     .pipe(imagemin())
//     .pipe(gulp.dest('dist/images'));
// });


app.use('/', require('./routes'));

const PORT = process.env.PORT || 5000;

if (cluster.isMaster) {
  for (let i = 0; i < numCpu; ++i) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    cluster.fork();
  });
} else {
  app.listen(PORT, () => {
    console.log(`server ${process.pid} started at http://localhost:${PORT}`);
  });
}

// app.listen(PORT, () => {
//   console.log(`server ${process.pid} started at http://localhost:${PORT}`);
// });
module.exports = app;
