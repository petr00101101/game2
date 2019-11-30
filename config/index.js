var configValues = require('./config.json');

module.exports = {
  getDbConnectionString: function() {
    return `mongodb://${configValues.appUname}:${configValues.appPwd}@${configValues.mongoDbOrigin}`;    
  }
}