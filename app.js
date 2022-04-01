var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const getConnectionDB = require('./database')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Load Database
getConnectionDB()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users-management/v1', usersRouter);

module.exports = app;
