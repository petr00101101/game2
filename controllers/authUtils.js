var jwt = require('jsonwebtoken');
const SECRET_KEY = require('../config/config.json').SECRET_KEY;

module.exports = {
  generateJWTToken: function(userData) {    
    return jwt.sign({id: userData}, SECRET_KEY,{ expiresIn: 15*60});    
  },    
  verifyToken: async function(jwtToken) {    
    try{
      var result = -1;
      await jwt.verify(jwtToken, SECRET_KEY,(err,decodedUserId)=>{
        if(err) {
          result = false;
          return;
        }
        else result = decodedUserId;        
      });
      
      return result;       
    }
    catch(e){
      console.log('Error verifyToken:',e);      
    }
  },
  parseHeaderVerfityToken: async function(req,res){
    try{
      var authHeader = req.header('Authorization');
      var token = authHeader.split(' ')[1]; 
      var result = await this.verifyToken(token);
      if(token && typeof token != 'undefined' && token != false) {
        return result;        
      }
      else return null;
    }
    catch(e){
      console.log('Error parseHeaderVerfityToken:',e);
    }
    
  }
}