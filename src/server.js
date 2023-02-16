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

// if (cluster.isMaster) {
//   for (let i = 0; i < numCpu; ++i) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     cluster.fork();
//   });
// } else {
//   app.listen(PORT, () => {
//     console.log(`server ${process.pid} started at http://localhost:${PORT}`);
//   });
// }

app.listen(PORT, () => {
  console.log(`server ${process.pid} started at http://localhost:${PORT}`);
});
module.exports = app;




// {
//   "name": "client",
//   "version": "0.1.0",
//   "private": true,
//   "dependencies": {
//     "@heroicons/react": "^1.0.2",
//     "@popperjs/core": "^2.9.2",
//     "@testing-library/jest-dom": "^5.14.1",
//     "@testing-library/react": "^11.2.7",
//     "@testing-library/user-event": "^12.8.3",
//     "axios": "^0.21.1",
//     "draft-js": "^0.11.7",
//     "draftjs-to-html": "^0.9.1",
//     "html-react-parser": "^1.2.7",
//     "html-to-draftjs": "^1.5.0",
//     "jwt-decode": "^3.1.2",
//     "moment": "^2.29.1",
//     "prop-types": "^15.7.2",
//     "react": "^17.0.2",
//     "react-content-loader": "^6.0.3",
//     "react-dnd": "^14.0.2",
//     "react-dnd-html5-backend": "^14.0.0",
//     "react-dom": "^17.0.2",
//     "react-draft-wysiwyg": "^1.14.7",
//     "react-error-boundary": "^3.1.3",
//     "react-icons": "^4.3.1",
//     "react-loading-skeleton": "^2.2.0",
//     "react-render-html": "^0.6.0",
//     "react-router-dom": "^5.2.0",
//     "react-scripts": "4.0.3",
//     "react-tag-input": "^6.7.3",
//     "react-toastify": "^8.0.3",
//     "web-vitals": "^1.1.2"
//   },
//   "scripts": {
//     "build:css": "postcss src/styles/tailwind.css -o src/styles/app.css",
//     "watch:css": "postcss src/styles/tailwind.css -o src/styles/app.css --watch",
//     "react-scripts:start": "sleep 5 && react-scripts start",
//     "react-scripts:dist": "react-scripts build",
//     "start": "run-p watch:css react-scripts:start",
//     "build": "run-s build:css react-scripts:dist",
//     "test": "react-scripts test",
//     "eject": "react-scripts eject"
//   },
//   "eslintConfig": {
//     "extends": [
//       "react-app",
//       "react-app/jest"
//     ]
//   },
//   "browserslist": {
//     "production": [
//       ">0.2%",
//       "not dead",
//       "not op_mini all"
//     ],
//     "development": [
//       "last 1 chrome version",
//       "last 1 firefox version",
//       "last 1 safari version"
//     ]
//   },
//   "devDependencies": {
//     "autoprefixer": "^10.2.6",
//     "babel-eslint": "^10.1.0",
//     "eslint": "^7.29.0",
//     "eslint-config-airbnb": "^18.2.1",
//     "eslint-config-prettier": "^8.3.0",
//     "eslint-plugin-import": "^2.23.4",
//     "eslint-plugin-jsx-a11y": "^6.4.1",
//     "eslint-plugin-prettier": "^3.4.0",
//     "eslint-plugin-react": "^7.24.0",
//     "eslint-plugin-react-hooks": "^4.2.0",
//     "npm-run-all": "^4.1.5",
//     "postcss": "^8.3.5",
//     "postcss-cli": "^8.3.1",
//     "prettier": "^2.3.1",
//     "tailwindcss": "^2.2.2"
//   }
// }