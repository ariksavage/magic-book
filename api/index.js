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


const { readdir } = require('fs').promises;

const getFileList = async (dirName) => {
    const files = [];
    let items = await readdir(dirName, { withFileTypes: true });

    items = items.filter(item => item.name[0] !== '.');

    for (const item of items) {
      item.path = `${dirName}/${item.name}`;

      if (item.isDirectory()) {
        item.children = (await getFileList(`${item.path}`));
      }
      item.name = item.name.replace(/\.[a-z0-9]+$/m,'');
      files.push(item);
    }
    return files;
};
/**
 * TEST
 */



  api.get('/api/test', (req, res) => {
    res.json({"response": "GET WORKS"});
  });

  api.post('/api/test', (req, res) => {
    res.json({"response": "POST WORKS"});
  });
/**
 * ASSETS
 */

api.post('/api/assets/list', (req, res) => {
  getFileList('./src/assets/Library').then((files) => {
    res.json(files);
  });
});

const server = api.listen(port, () => console.log(`Angular API listening at http://localhost:${port}`));
