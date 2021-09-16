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
                console.log('onboarding',result)
                res.sendStatus(403)
            }else{
                res.send({'tasks' : result})
            }
        }
 })

})

router.get('/all/userOnboarding', async (req,res,next)=> {
    await onboardSchema.find({}).then((result)=> {
        res.send({'alltasks' : result})
    }).catch((err)=> {
        res.sendStatus(404)
    })
})

router.post('/:empId' , (req,res,next)=> {
    var empId=req.params['empId']
    var details=req.body.details

    console.log(empId,details)
    if(!details)
    {
        res.sendStatus(404)
    }
    //we get here the tasks for the user
    // for loop for all employees
    // for loop for all designated employees
   const promises=details.map(async (det)=> {
       return await  onboardSchema.updateOne({
        empId : empId,
        "steps.id" : det.id
        
    } , {
        $set : {
            "steps.$.isCompleted" : true
        }
        })
    })
    Promise.all(promises)
    .then((result)=> {
        console.log(result)
        if(!result)
        {
            return res.sendStatus(403)
        }
        res.sendStatus(200)
    }).catch((err)=> {
        console.log('error in marking to do true',err)
        res.sendStatus(404)
    })
})

router.post('/add/employee' , async (req,res,next)=> {
    var output=req.body
    console.log('onboarding',output)
    var initialSteps=[{
        "id": "Submit documents"
    },
    {
    "id": "Collect Laptop"
    },
    {
        "id": "Collect ID"
    }
    ]
    await onboardSchema.findOneAndUpdate({empId : output.empId},
        {
            $set : {
                designation : output.designation,
                designation_id : output.designation_id,

            },
            $push:{
                steps : initialSteps
            }
        }, {upsert : true}
        
        ).then((result)=> {
            res.sendStatus(200)

    }).catch((error)=> {
        res.sendStatus(404)
    })
})

router.post('/task/designation', (req,res,next)=> {
    var designation=req.body.designation
    var task=req.body.tasks

    console.log(designation,task)
    if(!designation)
    {
        console.log('here in designation')
        return res.sendStatus(404)
    }

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
           return res.sendStatus(200)
            
        }
    })
})
router.post('/task/forAll' , (req,res,next)=> {
    var task=req.body.tasks
    console.log(task)
    if(!task)
    {
        return res.sendStatus(404)
    }
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