const express = require('express');
const app = express();
require('dotenv').config();

const path = require('path');
// using simple package for error handling
// require('express-async-errors');

app.use(express.json());

// importing routers
let dogRouter = require('./routes/dogs');

// logger
app.use((req, res, next) => {
  console.log(req.method, req.url);
  console.log('Request Body: ', req.body);
  // displaying response code
  res.on('finish', () => {
    console.log('Response status: ', res.statusCode);
    console.log();
  });

  next();
});

// we need to use the express.static after the logger to make it work
app.use('/static', express.static(path.join(__dirname, 'assets')));
// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json(
    'Express server running. No content provided at root level. Please use another route.'
  );
});

// using the router
app.use('/dogs', dogRouter);

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res, next) => {
  // throw new Error('Hello World!');
  next(new Error('Hello World!'));
});

app.all('*', (req, res) => {
  let err = new Error("The requested resource couldn't be found.");
  err.statusCode = 404;
  throw err;
  // next(err);
});

// setting custom error handling
app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    let jsonData;
    if (process.env.NODE_ENV === 'development') {
      jsonData = {
        status: err.statusCode || 500,
        message: err.message || 'Something went wrong',
        stack: err.stack,
      };
    } else {
      jsonData = {
        status: err.statusCode || 500,
        message: err.message || 'Something went wrong',
      };
    }
    res.status(err.statusCode || 500).json(jsonData);
  }
  next();
});
const port = process.env.PORT || 5001;
app.listen(port, () =>
  console.log(
    'Server is listening on port',
    port,
    'Running in',
    process.env.NODE_ENV,
    'environment'
  )
);
