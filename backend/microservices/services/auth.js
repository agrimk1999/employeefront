const router=require('express').Router()
const User=require('../../models/user.model')
const {OAuth2Client}=require('google-auth-library')
const jwt=require('jsonwebtoken')
const client=new OAuth2Client()

router.post('/' ,  (req,res,next)=> {
    const {token,googleId}=req.body
    client.verifyIdToken({idToken : token, audience:'20580104459-7i89gv3opg9fpjpe9n7vmfe5lfqpk856.apps.googleusercontent.com'}).then((response)=> {
        const {email_verified,name,email}=response.payload
        console.log(response.payload,email,googleId)
        if(email_verified)
        {
            User.findOne({email : email},(err,result)=> {
                if(err)
                {
                    console.log('error in finding user',err)
                    res.send(err)
                }else{
                    // console.log(result)
                    console.log(result)
                    
                    let jwtToken=jwt.sign(email , 'JWT_SECRET')
                    res.cookie({
                        "jwtGoogleToken" : jwtToken
                    })
                    var empId=result.empId
                    console.log(jwtToken,empId)
                    res.send({jwtToken,result})
                }
            })
            
        }else{
            return res.send(403).json({
                error: 'Email is not verified by google'
            })
        }
        

    })
   
})

// console.log('in auth.js',loggedinProfile)

module.exports=router


