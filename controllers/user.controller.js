var router = require('express').Router()
var UserSchema=require('../models/user.model')
const onboardSchema=require('../models/onboarding.model')

router.get('/:empId' ,  (req,res,next)=> {
    var empId=req.params['empId']

    UserSchema.findOne({empId : empId} , (err,result)=> {
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

router.get('/all/employees' , (req,res,next)=> {
    // console.log(req.body)
    // res.send('received request')
    UserSchema.find({} , (error,result)=> {
        if(error){
            console.log('error in finding users')
            res.sendStatus(404)
        }else{
            result=result.filter((e)=> {
                return e.role!==1
            })
            res.send({'allemp' : result})
        }
    })
})

router.post('/employee' , (req,res,next)=> {
    //update user details 
    var empDetails=req.body
    console.log(empDetails.courseID)
    res.sendStatus(200)
    UserSchema.findOneAndUpdate({empId : empDetails.empId} , {
        firstName : empDetails.firstName,
        lastName : empDetails.lastName,
        email : empDetails.email,
        empId : empDetails.empId,
        designation : empDetails.designation
    }, {new : true,upsert : true},(error,result)=> {
        if(error){
            console.log('error in updating or adding',error)
            res.sendStatus(404)
        }else{
            console.log(result)
        }
    })
})

module.exports=router