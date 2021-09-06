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


router.post('/update' , async (req,res,next)=> {
    var empId=req.body.empId
    var details=req.body.details
    var courseName=details[0].name
    var amount=details[0].amountCompleted
    //update employee information
    console.log(empId,details[0])
    console.log(courseName,amount)
   const promises=details.map(async (det)=> {
    return await UserSchema.updateOne({
        empId : empId,
        "courseID.id" : det.name
    },{
        $set : {
            "courseID.$.amountCompleted" : det.amountCompleted
        }
    })
   })

   Promise.all(promises)
   .then((response)=> {
       console.log(response)
       res.sendStatus(200)
   }).catch((err)=> {
       console.log('error in updating course amount completed',err)
       res.sendStatus(404)
   })
})

router.post('/add/course' , async (req,res,next)=> {
    var courseDetails=req.body
    // console.log(courseDetails)
    await courseSchema.insertMany(courseDetails)
    .then((result)=> {
        console.log(result)
        res.sendStatus(200)
    })
    .catch((err)=> {
        console.log('error in adding all courses',err)
        res.sendStatus(404)
    })
    
})

router.post('/designation/course' , async (req,res,next)=> {
    var desgnation=req.body.designation
    var courses = req.body.courses

    await UserSchema.updateMany({designation : desgnation} , {
        $push : {
            courseID : courses
        }
    }, {new : true , upsert: true})
    .then((result)=> {
        console.log(result)
        res.sendStatus(200)
    }).catch((err)=> {
        console.log('error in adding course for designation',err)
        res.sendStatus(404)
    })
})




module.exports=router