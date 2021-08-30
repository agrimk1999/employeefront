var router=require('express').Router()
const UserSchema=require('../models/user.model')
const courseSchema=require('../models/course.model')




router.get('/:courseId' , (req,res,next)=> {
    var courseID=req.params['courseId']

    courseSchema.findOne({courseID : courseID} , (err,result)=> {
        if(err)
        {
            console.log('Error in course',err)
            res.sendStatus(404)
        }else{
            if(!result)
            {
                console.log('No such course')
                res.sendStatus(403)
            }else{
                res.send({'course' : result})
            }
        }
    })
})

router.get('/:empId' , (req,res,next)=> {
    var empId=req.params['empId']

    UserSchema.findOne({empId  : empId} , (err,result)=> {
        if(err)
        {
            console.log(err)
            res.sendStatus(404)
        }else{
            if(!result){
                console.log('No user')
                res.sendStatus(403)
            }else{
                res.send({'empCourse' : result})
            }
        }
    })

})


router.post('/update' , (req,res,next)=> {
    var empId=req.body.empId
    var details=req.body.details
    var courseName=details[0].name
    var amount=details[0].amountCompleted
    //update employee information
    console.log(empId,details[0])
    console.log(courseName,amount)

    UserSchema.updateOne({
        empId : empId,
        "courseID.id" : courseName
    },{
        $set : {
            "courseID.$.amountCompleted" : amount
        }
    },(err,result)=> {
        if(err)
        {
            console.log('error in course updating' , err)
            res.sendStatus(404)
        }else{
            console.log(result)
            res.sendStatus(200)
        }

    })
})

module.exports=router