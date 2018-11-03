const {mongoose} = require('./../db/mongoose');
const {User} = require('./../models/userschema');


exports.user = function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.pass !== req.body.passconf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.pass &&
    req.body.passconf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.pass,
      //passwordConf: req.body.passconf,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpass) {
    User.authenticate(req.body.logemail, req.body.logpass, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        if(user.admin){
          return  res.render('./../views/adminpage',)
          }
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
}
exports.userlogin = function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return res.redirect('/');
        } else {
          if(user.admin){
            return  res.render('./../views/adminpage',)
          }
          return res.render('./../views/profile.ejs');
        }
      }
    });
}

exports.logout = function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
}

exports.userretreive = (req,res) =>{
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return res.redirect('/');
        } else {
          User.find().then((users) => {
          return  res.render('./../views/adminpage2', {
              users: users
            } );
          }, (e) => {
          return  res.status(400).send(e);
          })
        }
      }
    });
}

exports.deleteuser = (req, res) => {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return res.redirect('/');
        } else {
          console.log(req.query.id);
          User.findOneAndDelete(req.query.id).then((users) => {
          return  res.send('<p> User deleted. Press ok to continue</p><a href="/userretreive"><button>Ok</button></a>');
          }, (e) => {
          return  res.status(400).send(e);
          })
        }
      }
    });
}
