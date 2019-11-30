var config = require('./config')
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var apiController = require('./controllers/apiController');

var port = process.env.PORT || 5000;
console.log(`Listening on port ${port}`);

var connectionString = config.getDbConnectionString();

mongoose.connect(connectionString, { useNewUrlParser: true })
  .then( () => {console.log("Database connected!");},
    err => {console.error(`Connection error!\n`, err);}
   );

apiController(app);
  
app.listen(port);