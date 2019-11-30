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

  app.post('/api/getUsers', cors(corsOptions), function(req,res){
    User.find({},(err,users)=>{
      if(err) {console.log("saveQuestionAnswer error!: ",err)}      
      res.send(users);
    })
  });

  app.post('/api/getQuestions', cors(corsOptions), function(req,res){
    Question.find({},(err,questions)=>{
      if(err) {console.log("getQuestions error!: ",err)}
      res.send(questions);
    })
  });

  app.post('/api/saveQuestionAnswer', cors(corsOptions), jsonParser, function(req,res){    
    var data = req.body;    

    User.findById(data.authedUser,(err,user)=>{
      if(err) {console.log("saveQuestionAnswer, find user error!: ",err)}

      user.answers = {
        ...user.answers,
        [data.qid]: data.answer
      };      

      user.save().then(()=>{

        Question.findById(data.qid,(err,question)=>{
          if(err) {console.log("saveQuestionAnswer, find question error!: ",err)}

          question[data.answer].votes.push(data.authedUser);
          question.save((err,res)=>{console.log("Saved Question.");})
          res.send(true);
        })
      });    

    })
  });

  app.post('/api/saveQuestion', cors(corsOptions), jsonParser, function(req,response){    
    var data = req.body;    

    var newQuestion = new Question(data.question);
    newQuestion.save((err,savedNewQuestion)=>{
      if(err) {console.log("saveQuestion, save question error!: ",err)}

      User.findById(data.authedUser, (err, newUser)=>{
        if(err) {console.log("saveQuestion, find user error!: ",err)}
        
        newUser.questions = newUser.questions.concat(savedNewQuestion._id);        
        newUser.save((err,res)=>{
          if(err) {console.log("saveQuestion, save user error!: ",err)}
          response.send(savedNewQuestion);
        })
      })

    })
  });


}