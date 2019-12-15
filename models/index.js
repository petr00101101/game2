var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  avatarURL: String,
  answers: Schema.Types.Mixed,
  questions: [String],
  username: String,
  password: String
}, { collection: 'user' });

var questionSchema = new Schema({
  author: String,
  timestamp: Number,
  optionOne: {
    votes: [String],
    text: String
  },
  optionTwo: {
    votes: [String],
    text: String
  }
}, { collection: 'question' });

var User = mongoose.model('User', userSchema);
var Question = mongoose.model('Question', questionSchema);

module.exports = { User, Question };