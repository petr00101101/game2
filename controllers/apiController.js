var models = require('../models');
var bodyParser = require('body-parser');
var cors = require('cors')
var configValues = require('../config/config.json')

var User = models.User;
var Question = models.Question;

var corsOptions = {
  origin: configValues.originUrl,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

module.exports = function(app) {

  var jsonParser = bodyParser.json();
  app.options('/api/*', cors(corsOptions))

  handleError = function(url, err, res) {
    res.status(500).send(`Error calling ${url}: ${err}`);
  }

  app.post('/api/getUsers', cors(corsOptions), function(req,res){
    User.find({},(err,users)=>{      
      if(err) handleError('/api/getUsers', err, res);
      else res.status(200).send(users);
    })   

  });

  app.post('/api/getQuestions', cors(corsOptions), function(req,res){
    Question.find({},(err,questions)=>{      
      if(err) handleError('/api/getQuestions', err, res);
      else res.status(200).send(questions);
    })    

  });

  app.post('/api/saveQuestionAnswer', cors(corsOptions), jsonParser, function(req,response){    
    var data = req.body;    

    User.findById(data.authedUser,(err,user)=>{      
      if(err) { handleError('/api/saveQuestionAnswer', err, response); return;}

      user.answers = {
        ...user.answers,
        [data.qid]: data.answer
      };      

      user.save().then(()=>{

        Question.findById(data.qid,(err,question)=>{          
          if(err) { handleError('/api/saveQuestion', err, response); return;}

          question[data.answer].votes.push(data.authedUser);
          question.save((err,res)=>{
            if(err) { handleError('/api/saveQuestion', err, response); return; }
            response.sendStatus(200);  
          })
            
        })
      });
    })
  });

  app.post('/api/saveQuestion', cors(corsOptions), jsonParser, function(req,response){    
    var data = req.body;    

    var newQuestion = new Question(data.question);
    newQuestion.save((err,savedNewQuestion)=>{      
      if(err) { handleError('/api/saveQuestion', err, response); return; }

      User.findById(data.authedUser, (err, newUser)=>{        
        if(err) { handleError('/api/saveQuestion', err, response);  return;}
        
        newUser.questions = newUser.questions.concat(savedNewQuestion._id);        
        newUser.save((err,res)=>{          
          if(err) { handleError('/api/saveQuestion', err, response); return; }
          response.status(200).send(savedNewQuestion);
        })
      })
    })
  });

}