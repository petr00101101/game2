var models = require('../models');

var User = models.User;

module.exports = function(userName) {  
    User.findOne({ 'username': userName },(err, user) => {
      if(err) return null;
      else return user;
    }) 
}