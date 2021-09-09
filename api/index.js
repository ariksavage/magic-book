const bodyParser = require('body-parser');
const express = require('express')
const port = 3000;

const api = express();
const Database = require('./database.js');
const fs = require('fs');

api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());

const dbConfigData = fs.readFileSync('config/db.config', {encoding:'utf8', flag:'r'});

dbConfig = JSON.parse(dbConfigData);
const db = new Database(dbConfig);

api.listen(port)
console.log(`API is listening at localhost:${port}`);
