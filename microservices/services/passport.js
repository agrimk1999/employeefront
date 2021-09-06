const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../../config/keys');
const UserSchema = require('../../models/user.model');



//here we take the user from callback function and grab info from user and stuff in cookie to send across browser
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//deserializing
passport.deserializeUser((id, done) => {
    console.log(id)
    UserSchema.findById(id).then((user) => {
        done(null, user);
    }).catch((err)=> {
        console.log('Error in deserialise',err)
    })
});

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
         //accessToken is used to access the users profile,mails
        //refreshtoken is cause the accesstoken expires after a while
        //profile is the one that brings back info from google
        //done fucntion is called after we are done with callback
        // check if user already exists in our own db
        console.log(profile)
        UserSchema.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null, currentUser);
                console.log("profile",profile);
                console.log("access token",accessToken);
            } else {
                
               done(null,false)
            }
        }).catch((err)=> {
            console.log('Error in mongoose',err)
        })
    })
);
