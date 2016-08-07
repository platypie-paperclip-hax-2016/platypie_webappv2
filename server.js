var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var nunjucks = require('nunjucks');
var mongoose = require('mongoose');
var passport = require('passport');

// Load environment variables from .env file
dotenv.load();

// Models
var models = require('./models')

// Controllers
var HomeController = require('./controllers/home');
var userController = require('./controllers/user');
var contactController = require('./controllers/contact');

// Passport OAuth strategies
require('./config/passport');

var app = express();


mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});
// view engine setup
nunjucks.configure('views', {
  autoescape: true,
  express: app
});
app.set('view engine', 'html');
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', HomeController.index);
app.get('/contact', contactController.contactGet);
app.post('/contact', contactController.contactPost);
app.get('/account', userController.ensureAuthenticated, userController.accountGet);
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
app.get('/signup', userController.signupGet);
app.post('/signup', userController.signupPost);
app.get('/login', userController.loginGet);
app.post('/login', userController.loginPost);
app.get('/forgot', userController.forgotGet);
app.post('/forgot', userController.forgotPost);
app.get('/reset/:token', userController.resetGet);
app.post('/reset/:token', userController.resetPost);
app.get('/logout', userController.logout);
app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));

const generateControllers = function (model) {
  function create(req, res, next) {
    if (Array.isArray(req.body)) {
      Promise.all(req.body.map(obj => {
        const doc = new model(obj)
        return doc.save()
      }))
      .then(() => res.send(req.body))
      .catch(err => next(err))
    }
    else {
      const doc = new model(req.body)
      doc.save()
      .then(() => res.send(doc))
      .catch(err => next(err))
    }
  }
  function find (req, res, next) {
    model.find(req.query).exec()
    .then((docs) => res.send(docs))
    .catch(err => next(err))
  }
  return {find, create}
}
const universityController = generateControllers(models.University)
const majorController = generateControllers(models.Major)
const industryController = generateControllers(models.Industry)
const cityController = generateControllers(models.City)

app.post('/api/university', universityController.create)
app.get('/api/university', universityController.find)
app.post('/api/major', majorController.create)
app.get('/api/major', majorController.find)
app.post('/api/industry', industryController.create)
app.get('/api/industry', industryController.find)
app.post('/api/city', cityController.create)
app.get('/api/city', cityController.find)

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), '128.199.219.234', function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
