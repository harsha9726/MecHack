const express = require('express');
const app = express();
const {mongoose} = require('./db/mongoose');
var session = require('express-session');
//var MongoStore = require('connect-mongo')(session);


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//controllers
var userController = require('./controllers/usercontroller');


app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


app.get('/newAccount', function (request, response) {
  response.render("Register.ejs");
});


//user authentication
app.get('/', function (request, response) {
  response.render("index.ejs");
});


//POST route for updating data
app.post('/admin', userController.user);

app.get('/delete', userController.deleteuser);

// GET route after registering
app.get('/profile', userController.userlogin);
app.get('/admin', userController.userlogin);
app.get('/userretreive', userController.userretreive);


// GET for logout logout
app.get('/logout', userController.logout);

//user authentication end


app.listen(app.get('port'), process.env.IP, function () {

  console.log("Node Server running at port:" + app.get('port'));


});
