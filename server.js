var express = require('express');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var routes = require('./app/routes/index');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use('/common', express.static(process.cwd() + '/app/common'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

var port = process.env.PORT || 8080

routes(app, passport)

app.listen(port, () => {
  console.log(`listening to port: ${port}...`)
})
