var passport = require("passport");
var passportJWT = require("passport-jwt");
const UserSchema=require('../../models/user.model')
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'JWT_SECRET';
jwtOptions.passReqToCallback=true

var strategy = new JwtStrategy(jwtOptions, function(req,jwt_payload, done) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  UserSchema.findOne({email : jwt_payload},(err,user)=>{
    if (user) {
        req.user=user
        done(null, user);
      } else {
        done(null, false);
      }
  })
  
});

passport.use(strategy);