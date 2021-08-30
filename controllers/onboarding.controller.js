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
    onboardSchema.updateOne({
        empId : empId,
        "steps.id" : details[0]
    } , {
        $set : {
            "steps.$.isCompleted" : true
        }
    },(err,result)=> {
        if(err)
        {
            console.log(err)
            res.sendStatus(404)
        }else{
            if(!result)
            {
                res.send('Cant update')
            }else{
                console.log(result)
                res.sendStatus(200)
            }
        }
    })

})

module.exports=router