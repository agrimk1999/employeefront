var router = require('express').Router()
var UserSchema=require('../models/user.model')
const onboardSchema=require('../models/onboarding.model')

router.get('/:empId' , async (req,res,next)=> {
    var empId=req.params['empId']

   await UserSchema.findOne({empId : empId} , (err,result)=> {
        if(err){
            console.log('error in finding user' , err)
            res.sendStatus(404)
        }
        if(!result)
        {
            res.sendStatus(403)
        }else{
            res.send({'emp' : result})
        }
    })
})

router.post('/employee' , (req,res,next)=> {
    //update user details 
})

module.exports=router