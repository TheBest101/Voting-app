'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Polls = new Schema({
	owner: String,
  name: String,
  data: [
    {
      ip: String,
      choice: String
    }
  ],
  options: []
});

module.exports = mongoose.model('Polls', Polls);
