const bodyParser = require('body-parser');
const express = require('express')
const port = 3000;

const api = express();
const Database = require('./database.js');
const fs = require('fs');

api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());
// Calling the readFileSync() method
// to read 'input.txt' file
const dbConfigData = fs.readFileSync('config/db.config',
            {encoding:'utf8', flag:'r'});

dbConfig = JSON.parse(dbConfigData);
const db = new Database(dbConfig);

api.get('/api/race/list', (req, res) => {
  db.query("SELECT * from races").then(result =>{
    res.json(result);
  })
});

api.post('/api/query', (req, res) => {
  const query = req.body.query;

  db.query(query).then(result =>{
    res.json(result);
  })
});

api.listen(port)
console.log('API is listening at localhost:'+port);
