var router=require('express').Router()
const UserSchema=require('../models/user.model')
const onboardSchema=require('../models/onboarding.model')


router.get('/:empId' , async (req,res,next)=> {
    var empId=req.params['empId']
   await onboardSchema.findOne({empId : empId}, (err,result)=> {
        if(err)
        {
            console.log(err)
            res.sendStatus(404)
        }else{
            if(!result)
            {
                res.sendStatus(403)
            }else{
                res.send({'tasks' : result})
            }
        }
 })

})


router.post('/:empId' , (req,res,next)=> {
    var empId=req.params['empId']
    var details=req.body.details

    console.log(empId,details[0])
    //we get here the tasks for the user
    // for loop for all employees
    // for loop for all designated employees
   const promises=details.map(async (det)=> {
       return await  onboardSchema.updateOne({
        empId : empId,
        "steps.id" : det.task
    } , {
        $set : {
            "steps.$.isCompleted" : true
        }
        })
    })
    Promise.all(promises)
    .then((result)=> {
        console.log(result)
        res.sendStatus(200)
    }).catch((err)=> {
        console.log('error in marking to do true',err)
        res.sendStatus(404)
    })
})

router.post('/task/designation', (req,res,next)=> {
    var designation=req.body.designation
    var task=req.body.tasks

    console.log(designation,task)

    onboardSchema.updateMany({designation : designation} , {
        $push : {
            steps : task
        }
    },{new : true,upsert : true}, (err,result)=> {
        if(err)
        {
            console.log('error in onboarding task designation',err)
            res.sendStatus(404)
        }else{
            console.log(result)
            res.sendStatus(200)
        }
    })
})
router.post('/task/forAll' , (req,res,next)=> {
    var task=req.body.tasks
    console.log(task)
    onboardSchema.updateMany({} , {
        $push : {
            steps : task
        }
    },{new : true,upsert : true}, (err,result)=> {
        if(err)
        {
            console.log('error in onboarding steps for all' , err)
            res.sendStatus(404)
        }else{
            console.log(result)
            res.sendStatus(200)
        }
    })
})
module.exports=router