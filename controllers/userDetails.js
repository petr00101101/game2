var models = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 8;

var User = models.User;

module.exports = {
  getUserDetailsByUserNamePassword: async function(userName, password) {    
    
    var user = await User.findOne({ 'username': userName})
    
    if (user == null) return null;              
    
    const match = await bcrypt.compare(password, user.password);
    
    if(match === true) { user.password = null; return user; }    
    else return null;
  
  },
  getUserDetailsById: async function(id) {  
    return User.findById(id,'-password',(err, user) => {
      if(err) return null;
      return user;
    }) 
  },

}