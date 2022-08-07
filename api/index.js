process.title = 'angular api';

const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const express = require('express');
const fs = require('fs');

const api = express();
api.use(fileUpload({
    useTempFiles : true,
    tempFileDir : 'tmp/'
}));
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());
const port = 4201;

/**
 * TEST
 */

  api.get('/api/test', (req, res) => {
    res.json({"response": "GET WORKS"});
  });

  api.post('/api/test', (req, res) => {
    res.json({"response": "POST WORKS"});
  });

const server = api.listen(port, () => console.log(`Angular API listening at http://localhost:${port}`));
