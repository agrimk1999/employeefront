const express=require('express')
const cors=require('cors')
const path=require('path')
const request=require('request')
const localStorage=require('localStorage')
const keys = require('../config/keys')
const cookieSession = require('cookie-session');
const passport=require('passport')
const cookieparser=require('cookie-parser')
const formidable=require('formidable')
const fs=require('fs')
require('./services/passport')
const {authenticate,isAdmin}=require('./services/middleware')
require('../config/database')
require('dotenv').config({path: path.join(__dirname,'..','.env')})
const swaggerUI=require('swagger-ui-express')
const doc=require('../openapi.json')

var app=express()

const {DBCASE,PORT_SERVICE_EMPLOYEE,APIENDPOINT}=require('../config/keys')

app.use(express.static(path.join(__dirname,'/public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieparser())

app.use(cookieSession({
    keys: [keys.session.cookieKey],
    maxAge: (24*60*60 * 1000)
}));
app.use(passport.initialize())
app.use(passport.session())


app.set('view engine' , 'jade')

const UserSchema = require('../models/user.model')


if(DBCASE==='PRODUCTION')
{
app.use('/googlelogin' , require('./services/auth'))
}

app.use('/api-docs/employee',swaggerUI.serve,swaggerUI.setup(doc))

app.get('/userLogout',authenticate,(req, res) => {
    res.clearCookie('jwtGoogleToken')
    req.logout()
    res.send('Logged Out')
});



app.get('/empDashboard/:empId' ,authenticate, (req,res,next)=> {
    console.log('dashboard user',req.user)
    var empId=req.params['empId']
    var output = {
        "tasks" : {},
        "courseEmp" : {}
    }
    getRequestToEmployee(empId).then((result)=> {
        output.courseEmp=result
        getRequestToonBoarding(empId).then((data)=> {
            output.tasks={...data}
            res.send({'emp' : output})
            console.log(output)
        }).catch((err)=> {
            if(err.message=='Error Message : 403')
        {
            res.status(403).send({
                message: ''
            })
        }else{
            res.status(404).send({
                message: ''
            })
        }
        })
        }).catch((err)=> {
        if(err.message=='Error Message : 403')
        {
            res.status(403).send({
                message: ''
            })
        }else{
            res.status(404).send({
                message: ''
            })
        }
    })

  

})


app.post('/empUpdateCourses',authenticate,(req,res,next)=> {
    var empId=req.user.empId
    var checkedSteps=req.body.steps
    var obj={
        "empId" : empId,
        "details" : checkedSteps
    }
    var url = `${APIENDPOINT}/course/update`
    request.post({
        headers: {'content-type' : 'application/json'},
        url : url,
        body : JSON.stringify(obj)
    },(err,response,body)=> {
            if(response.statusCode==404)
            {
                return  res.status(404).send({
                    message : ''
                })
            }
            res.status(200).send({message : 'added successfully'})
        
    })
})


app.post('/empUpdateToDo',authenticate,(req,res,next)=> {
    var empId=req.user.empId
    var checkedSteps=req.body.tasks
    var obj={
        "empId" : empId,
        "details" : checkedSteps
    }
    var url = `${APIENDPOINT}/onboarding/${empId}`
    request.post({
        headers: {'content-type' : 'application/json'},
        url : url,
        body : JSON.stringify(obj)
    },(err,response,body)=> {
            if(response.statusCode==404)
            {
                return  res.status(404).send({
                    message : ''
                })
            }
            res.send({message : 'added successfully'})
        
    })
})




app.get('/adminDashboardEmployee' , authenticate,isAdmin,(req,res,next)=> {
    var finalOutput={
       courseUsers : {},
       taskUsers : {}
   }
   var url=`${APIENDPOINT}/user/all/employees`
   request.get({
       url : url
   }, (error,response,body)=> {
          if(response.statusCode!=200)
          {
              return res.status(404)
          }
           var output=JSON.parse(response.body)
           
           var allUsers=output.allemp
           finalOutput.courseUsers=allUsers

           request.get({
               url : `${APIENDPOINT}/onboarding/all/userOnboarding`
           }, (error,response,body)=> {
                  if(response.statusCode==200)
                  {
                      var taskOutput=JSON.parse(response.body)
                      var temptasks=taskOutput.alltasks
                      finalOutput.taskUsers=temptasks
                      res.send({'finalOutput' : finalOutput})
                  }else{
                      res.status(404).send({
                          message: ""
                      })
                  }
               
           })
       
   })
   
})


app.post('/adminAddEmployee',authenticate,isAdmin,(req,res,next)=> {
   var empDetails=req.body
   var url=`${APIENDPOINT}/user/employee`
   request.post({
       headers: {'content-type' : 'application/json'},
       url : url,
       body : JSON.stringify(empDetails)
   }, (error,response,body)=> {
           if(response.statusCode==200)
           {
               res.send({message : 'added successfully'})
           }else{
               res.status(404).send({
                   message: ""
               })
           }
       
   })
})

app.post('/editAnEmployee' ,authenticate,isAdmin ,(req,res,next)=> {
   var details=req.body
   var url=`${APIENDPOINT}/user/employee`
   request.post({
       headers: {'content-type' : 'application/json'},
       url : url,
       body : JSON.stringify(details)
   }, (error,response,body)=> {
           if(response.statusCode==200)
           {
               res.send({message : 'added successfully'})
           }else{
               res.status(404).send({
                   message: ""
               })
           }
       
   })
})

app.post('/addToDo' ,authenticate,isAdmin, (req,res,next)=> {
   var onboardDetails=req.body

   var url=`${APIENDPOINT}/onboarding/task/designation`
   request.post({
       headers: {'content-type' : 'application/json'},
       url : url,
       body : JSON.stringify(onboardDetails)
   },(error,response,body)=>{
           if(response.statusCode==200)
           {
               res.send({message : 'added successfully'})
           }else{
               res.status(404).send({
                   message: ""
               })
           }
       
   })
})

app.post('/addToDoforAll' , authenticate,isAdmin,(req,res,next)=> {
   var onboardDetails=req.body

   var url=`${APIENDPOINT}/onboarding/task/forAll`
   request.post({
       headers: {'content-type' : 'application/json'},
       url : url,
       body : JSON.stringify(onboardDetails)
   },(error,response,body)=>{
           if(response.statusCode==200)
           {
               res.send({message : 'added successfully'})
           }else{
               res.status(404).send({
                   message: ""
               })
           }
       
   })
})

app.get('/adminGetCourses', authenticate, isAdmin,(req,res,next)=> {
   var url=`${APIENDPOINT}/course/courses/all`
   request.get({
       url : url
   },(err,response,body)=> {
          if(response.statusCode==200){ 
           var output=JSON.parse(response.body)
           var allCourses=output.courses
           res.send({'allCourses' : allCourses})
       }else{
           res.status(404).send({
               message: ""
           })
       }
       
   })
})
app.post('/adminAddCourse' ,authenticate, isAdmin,(req,res,next)=> {
   var courseDetails=req.body

   var url=`${APIENDPOINT}/course/add/course`
   request.post({
       headers: {'content-type' : 'application/json'},
       url : url,
       body : JSON.stringify(courseDetails)
   },(error,response,body)=>{
           if(response.statusCode==200)
           {
               res.send({message : 'added successfully'})
           }else{
               res.status(404).send({
                   message: ""
               })
           }
       
   })
})
app.post('/adminCourseDesignation' ,authenticate,isAdmin, (req,res,next)=> {
   var courseDetaills=req.body
   var url=`${APIENDPOINT}/course/designation/course`
   request.post({
       headers: {'content-type' : 'application/json'},
       url : url,
       body : JSON.stringify(courseDetaills)
   },(error,response,body)=>{
           if(response.statusCode==200)
           {
               res.send({message : 'added successfully'})
           }else{
               res.status(404).send({
                   message: ""
               })
           }
       
   })
})

app.post('/adminCourseforAll' ,authenticate,isAdmin, (req,res,next)=> {
    var courseDetaills=req.body
    var url=`${APIENDPOINT}/course/forall/course`
    request.post({
        headers: {'content-type' : 'application/json'},
        url : url,
        body : JSON.stringify(courseDetaills)
    },(error,response,body)=>{
            if(response.statusCode==200)
            {
                res.send({message : 'added successfully'})
            }else{
                res.status(404).send({
                    message: ""
                })
            }
        
    })
 })

app.post('/adminEditCourse', authenticate,isAdmin, (req,res,next)=> {
    var courseDetails=req.body
    var url=`${APIENDPOINT}/course/edit/existCourse`
    request.post({
        headers: {'content-type' : 'application/json'},
        url : url,
        body : JSON.stringify(courseDetails)
    },(error,response,body)=>{
            if(response.statusCode==200)
            {
                res.send({message : 'added successfully'})
            }else{
                res.status(404).send({
                    message: ""
                })
            }
        
    })
})



async function getRequestToEmployee(empId){
    var url=`${APIENDPOINT}/user/${empId}`
    return new Promise(function(resolve,reject){
        request.get({
            url : url
        },(err,response,body)=> {
    
            if(err)
            {
                reject(new Error('Error Message : 404'))
            }else{
                if(response.statusCode==403)
                {
                   reject(new Error('Error Message : 403'))
                }else{
                var out=JSON.parse(response.body)
                var emp=out.emp
                resolve(emp)
                }
    
    
            }
    
        })
    })
}

async function getRequestToonBoarding(empId){
    var url=`${APIENDPOINT}/onboarding/${empId}`
    return new Promise(function(resolve,reject){
        request.get({
            url : url
        },(err,response,body)=> {
    
            if(err)
            {
                reject(new Error('Error Message : 404'))
            }else{
                if(response.statusCode==403)
                {
                    reject(reject(new Error('Error Message : 403')))
                }else{
                var out=JSON.parse(response.body)
                var emp=out.tasks
                resolve(emp)
                }
    
    
            }
    
        })
    })
}

app.listen(PORT_SERVICE_EMPLOYEE || 7901, ()=> {
    console.log(`Employee service started on ${PORT_SERVICE_EMPLOYEE}`)
})


module.exports=app