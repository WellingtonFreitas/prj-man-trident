
const express = require('express');

const bodyParser = require('body-parser');

const app = express();

require('./app/controllers/index')(app);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));


app.listen(3000);
console.log('Server run on localhost:3000');


