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
    var courseName=details[0].id
    var amount=details[0].amountCompleted
    //update employee information
    console.log(empId,details)
    console.log(courseName,amount)
   const promises=details.map(async (det)=> {
    return await UserSchema.updateOne({
        empId : empId,
        "courseID.id" : det.id
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

router.get('/courses/all' , async (req,res,next)=> {
    await courseSchema.find({}).then((result)=> {
        res.send({'courses' : result})
    }).catch((err)=> {
        console.log('Error in retreiving all courses',err)
        res.sendStatus(404)
    })
    
})

router.post('/add/course' , async (req,res,next)=> {
    var courseDetails=req.body
    console.log('in course controllers',courseDetails)
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
    console.log('course controller',desgnation,courses)
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

router.post('/forall/course', async (req,res,next)=> {
    var courses = req.body.courses
    console.log('course controller',desgnation,courses)
    await UserSchema.updateMany({} , {
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

router.post('/edit/existCourse',async (req,res,next)=> {
    var course=req.body.course
    console.log(course)
    await courseSchema.findOneAndUpdate({courseName : course.courseName},{
        $set :{
            ...course
        }
    }).then((result)=> {
        console.log(result)
        if(!result)
        {
            res.sendStatus(403)
        }else{
            res.sendStatus(200)
        }
    }).catch((err)=> {
        console.log('error in edit course',err)
        res.sendStatus(404)
    })
})


module.exports=router