var router = require('express').Router()
var UserSchema=require('../models/user.model')
const onboardSchema=require('../models/onboarding.model')
const request=require('request')

router.get('/:empId' ,  (req,res,next)=> {
    var empId=req.params['empId']
    console.log(empId)
    UserSchema.findOne({empId : empId} , (err,result)=> {
        if(err){
            console.log('error in finding user' , err)
            res.sendStatus(404)
        }
        if(!result)
        {
            console.log('user controller',result)
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

router.post('/employee' , async (req,res,next)=> {
    //update user details 
    var empDetails=req.body
    var courses=empDetails.courseID
    // courses=courses.split(';')
    console.log(courses)
    // courses=courses.forEach(element => {
    //     return JSON.parse(element)
    // });
    // console.log(courses)
   const user=await UserSchema.findOneAndUpdate({empId : empDetails.empId} , {
       $set : {
           ...empDetails
       },
    }, {upsert : true})

    req.body.designation_id=empDetails.designation.substring(0,1)
    
        
            request.post({
                headers : {'content-type' : 'application/json'},
                url : `http://localhost:8080/onboarding/add/employee`,
                body : JSON.stringify(req.body)
            },(error,response,body)=> {
                if(error)
                {
                    res.sendStatus(404)
                }else{
                    // console.log(response)
                    res.sendStatus(200)
                }
            })

})

module.exports=router