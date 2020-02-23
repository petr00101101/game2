var models = require('../models');
var bodyParser = require('body-parser');
var cors = require('cors')
var configValues = require('../config/config.json')
var userDetails = require('./userDetails.js')
var authUtils = require('./authUtils.js');

var minutesToTokenRefresh = 3;

var User = models.User;
var Question = models.Question;

var corsOptions = {
  origin: configValues.originUrl,
  optionsSuccessStatus: 200
}

module.exports = function(app) {

  var jsonParser = bodyParser.json();
  app.options('/api/*', cors(corsOptions))

  const handleError = function(url, err, res) {
    res.status(500).send(`Error calling ${url}: ${err}`);

    // TODO print errors to a log
  }

  app.post('/api/validateToken',cors(corsOptions), async function (req,res) {
    var decodedToken = await authUtils.parseHeaderVerfityToken(req,res);      
    if (decodedToken){
      let newToken = '';                
      var user = await userDetails.getUserDetailsById(decodedToken.id);      
      if(user && !user.isDisabled) {

        if ( (decodedToken.exp - Math.floor(Date.now()/1000) ) < minutesToTokenRefresh*60
          && (decodedToken.exp - Math.floor(Date.now()/1000) ) > 0 ) {
          newToken = authUtils.generateJWTToken(decodedToken.id);
        }     
        // TODO should authenticate path is allowed for user        
        
        res.status(200).send({'id' : user.id, 'token': newToken});
      }
      else res.sendStatus(400);      
    }
    else res.sendStatus(401);    
  })

  app.post('/api/login', cors(corsOptions), jsonParser, async function(req,res) {     
    let username = req.body.username;
    let password = req.body.password;
    let user = await userDetails.getUserDetailsByUserNamePassword(username, password);
    if (typeof user != 'undefined' && user && !user.isDisabled) {            
      let token = authUtils.generateJWTToken(user.id);
      res.status(200).send({'user': user, 'token': token, 'success' : true});
    } 
    else res.status(401).send({'user': -1, 'token': -1, 'success' : false});     
  });


  app.post('/api/getUsers', cors(corsOptions), async function(req,res){
    var decodedToken = await authUtils.parseHeaderVerfityToken(req,res);
    if (decodedToken){
    
      let user = await userDetails.getUserDetailsById(decodedToken.id);
      if(user && !user.isDisabled) {

        User.find({}, {password: 0, isDisabled: 0} ,(err,users)=>{      
          if(err) handleError('/api/getUsers', err, res);
          else res.status(200).send(users); 
        })
      }
      else res.sendStatus(401);
    }
    else res.sendStatus(401); 
  });

  app.post('/api/getQuestions', cors(corsOptions), async function(req,res){
    var decodedToken = await authUtils.parseHeaderVerfityToken(req,res);
    if (decodedToken){

      let user = await userDetails.getUserDetailsById(decodedToken.id);
      if(user && !user.isDisabled) {

        Question.find({},(err,questions)=>{      
          if(err) handleError('/api/getQuestions', err, res);
          else res.status(200).send(questions);
        })
      }
      else res.sendStatus(401);
    }
    else res.sendStatus(401);         
  });

  app.post('/api/saveQuestionAnswer', cors(corsOptions), jsonParser, async function(req,res){    
    var decodedToken = await authUtils.parseHeaderVerfityToken(req,res);
    if (decodedToken){
      let user = await userDetails.getUserDetailsById(decodedToken.id);
      if(user && !user.isDisabled) {
      
        var data = req.body;    

        User.findById(data.authedUser,(err,user)=>{      
          if(err) { handleError('/api/saveQuestionAnswer', err, res); return;}

          user.answers = {
            ...user.answers,
            [data.qid]: data.answer
          };      

          user.save().then(()=>{

            Question.findById(data.qid,(err,question)=>{          
              if(err) { handleError('/api/saveQuestion', err, res); return;}

              question[data.answer].votes.push(data.authedUser);
              question.save((err,question)=>{
                if(err) { handleError('/api/saveQuestion', err, res); return; }
                else { res.sendStatus(200); return; }
              })
                
            })
          })
        })
      }
      else res.sendStatus(401);   
    }
    else res.sendStatus(401);
    
  });

  app.post('/api/saveQuestion', cors(corsOptions), jsonParser, async function(req,response){    
    var decodedToken = await authUtils.parseHeaderVerfityToken(req,response);
    if (decodedToken){
      let user = await userDetails.getUserDetailsById(decodedToken.id);
      if(user && !user.isDisabled) {

        var data = req.body;    

        var newQuestion = new Question(data.question);
        newQuestion.save((err,savedNewQuestion)=>{      
          if(err) { handleError('/api/saveQuestion', err, response); return; }

          User.findById(data.authedUser, (err, newUser)=>{        
            if(err) { handleError('/api/saveQuestion', err, response);  return;}
            
            newUser.questions = newUser.questions.concat(savedNewQuestion._id);        
            newUser.save((err,newerUser)=>{          
              if(err) { handleError('/api/saveQuestion', err, response); return; }
              else {response.status(200).send(savedNewQuestion); return;}
            })
          })
        })
      }
      else res.sendStatus(401);
    }
    else res.sendStatus(401);
    
  });

}