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
    var courses=empDetails.courseID
    // courses=courses.split(';')
    console.log(courses)
    // courses=courses.forEach(element => {
    //     return JSON.parse(element)
    // });
    // console.log(courses)
    UserSchema.findOneAndUpdate({empId : empDetails.empId} , {
       $set : {
           firstName : empDetails.firstName,
           lastName : empDetails.lastName,
           designation : empDetails.designation,
           address : empDetails.address,
           email : empDetails.email
       },
       $push : {
        courseID : courses
    }
    }, {new : true,upsert : true},(error,result)=> {
        if(error){
            console.log('error in updating or adding',error)
            res.sendStatus(404)
        }else{
            console.log(result)
            res.sendStatus(200)
        }
    })
})

module.exports=router