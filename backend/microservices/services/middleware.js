// const expressJwt=require('express-jwt')

// const isSignedIn=expressJwt({
//     secret : 'JWT_SECRET' ,
//     algorithms : ['HS256'],
//     userProperty : "auth"
// })


// const isAuthenticated=(req,res,next)=> {
//     // console.log('auth',req.auth)
//     console.log('user',req.user)
//     let permission=req.session.user&&req.auth&&req.session.user._id===req.auth._id
//     if(!permission)
//     {
//         return res.send(403).json({
//             error : "ACCESS DENIED"
//         })
//     }
//     next()
// }
const isAdmin = (req,res,next)=> {
    console.log('Admin',req.user)
    if(req.user.role==0)
    {
       return res.status(403).send({
           message: 'Unauthorized Access - Not an Admin!'
       })
    }
    next()
}
const passport = require("passport");

const authenticate = (req, res, next) => {
    passport.authenticate('jwt', function(err, user, info) {
        if (err) return next(err);

        if (!user) return res.status(401).json({message: "Unauthorized Access - No Token Provided!"});

        req.user = user;

        next();

    })(req, res, next);
};

module.exports={
    authenticate,
    isAdmin
}