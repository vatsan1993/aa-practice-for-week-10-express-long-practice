const express = require('express');
const app = express();

const path = require('path');
require('express-async-errors');

app.use(express.json());

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

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error('Hello World!');
});

app.all('*', (req, res) => {
  let err = new Error("The requested resource couldn't be found.");
  err.statusCode = 404;
  throw err;
});
const port = 5001;
app.listen(port, () => console.log('Server is listening on port', port));
