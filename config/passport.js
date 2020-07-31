

const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
/**
 * Expose
 */
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// use these strategies
passport.use('local', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (username, password, done) {
    console.log('passportPage:'+username);
    // console.log(`Trying to verify user, username:${username} password:${password}`)
    // if (username != 'joe' || password != 'password') {
    //     console.log(`Failed to verify user, username:${username} password:${password}`)
    //     return done(null, false, { message: 'Invalid username or password' });
    // }
    // return done(null, { "username": username, "password": password },{message:'Successfully authenticated!'});
  }
));
module.exports = passport;

// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcryptjs');

// // Load User model
// const User = require('../models/User');

// module.exports = function(passport) {

//     passport.use(
//     new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

//         console.log(email)
//       // Match user
//       User.findOne({
//         email: email
//       }).then(user => {
//         if (!user) {
//           return done(null, false, { message: 'That email is not registered' });
//         }

//         // Match password
//         bcrypt.compare(password, user.password, (err, isMatch) => {
//           if (err) throw err;
//           if (isMatch) {
//             return done(null, user);
//           } else {
//             return done(null, false, { message: 'Password incorrect' });
//           }
//         });
//       });
//     })
//   );

//   passport.serializeUser(function(user, done) {
//     done(null, user.id);
//   });

//   passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user) {
//       done(err, user);
//     });
//   });
// };
