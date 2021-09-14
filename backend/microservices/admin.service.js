var express=require('express')
var path=require('path')
var cors = require('cors')
const passport = require('passport')
require('./services/passport')
const keys = require('../config/keys')
const cookieSession = require('cookie-session');
const cookieparser=require('cookie-parser')
const request=require('request')
const {authenticate,isAdmin}=require('./services/middleware')
const swaggerUI=require('swagger-ui-express')
const doc=require('../openapi.json')

require('../config/database')
require('dotenv').config({path: path.join(__dirname,'..','.env')})

var app=express()

app.use(express.static(path.join(__dirname,'/public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieparser())

app.set('view engine' , 'jade')

app.use(cookieSession({
    keys: [keys.session.cookieKey],
    maxAge: (24*60*60 * 1000)
}));



app.use(passport.initialize());
app.use(passport.session());


app.use('/googlelogin' , require('./services/auth'))
app.use('/api-docs/employee',swaggerUI.serve,swaggerUI.setup(doc))

const UserSchema = require('../models/user.model');



app.get('/adminDashboardEmployee' , authenticate,isAdmin,(req,res,next)=> {
     var finalOutput={
        courseUsers : {},
        taskUsers : {}
    }
    var url=`${process.env.APIENDPOINT}/user/all/employees`
    request.get({
        url : url
    }, (error,response,body)=> {
        if(error){
            // console.log('error in admin user', error)
            res.send('Cant get users')
        }else{
           
            var output=JSON.parse(response.body)
            
            var allUsers=output.allemp
            finalOutput.courseUsers=allUsers

            request.get({
                url : 'http://localhost:8080/onboarding/all/userOnboarding'
            }, (error,response,body)=> {
                if(error)
                {
                    res.status(404).send({
                        message: 'Cannot get data.Server ran into some error'
                    })
                }else{
                   if(response.statusCode==200)
                   {
                       var taskOutput=JSON.parse(response.body)
                       var temptasks=taskOutput.alltasks
                       finalOutput.taskUsers=temptasks
                       res.send({'finalOutput' : finalOutput})
                   }else{
                       res.status(404).send({
                           message: "Something is wrong in getting dashboard"
                       })
                   }
                }
            })
        }
    })
    
})

app.get('/adminLogout', authenticate,isAdmin,(req, res) => {
    res.clearCookie('jwtGoogleToken')
    req.logout()
    
});


app.post('/adminAddEmployee',authenticate,isAdmin,(req,res,next)=> {
    var empDetails=req.body
    var url=`${process.env.APIENDPOINT}/user/employee`
    request.post({
        headers: {'content-type' : 'application/json'},
        url : url,
        body : JSON.stringify(empDetails)
    }, (error,response,body)=> {
        if(error)
        {
            // console.log('error in add employee' ,error)
            res.status(404).send({
                message: 'Cannot get data.Server ran into some error'
            })
        }else{
            if(response.statusCode==200)
            {
                res.send({message : 'added successfully'})
            }else{
                res.status(404).send({
                    message: "Something is wrong in getting dashboard"
                })
            }
        }
    })
})

app.post('/editAnEmployee' ,authenticate,isAdmin ,(req,res,next)=> {
    var details=req.body
    var url=`${process.env.APIENDPOINT}/user/employee`
    request.post({
        headers: {'content-type' : 'application/json'},
        url : url,
        body : JSON.stringify(details)
    }, (error,response,body)=> {
        if(error)
        {
            // console.log('error in add employee' ,error)
            res.status(404).send({
                message: 'Cannot get data.Server ran into some error'
            })
        }else{
            if(response.statusCode==200)
            {
                res.send({message : 'edited successfully'})
            }else{
                res.status(404).send({
                    message: "Something is wrong in getting dashboard"
                })
            }
        }
    })
})
//add a to do task wrt designation
//add a common to do task
app.post('/addToDo' ,authenticate,isAdmin, (req,res,next)=> {
    var onboardDetails=req.body

    var url=`${process.env.APIENDPOINT}/onboarding/task/designation`
    request.post({
        headers: {'content-type' : 'application/json'},
        url : url,
        body : JSON.stringify(onboardDetails)
    },(error,response,body)=>{
        if(error)
        {
            // console.log('error in add onboarding' ,error)
            res.status(404).send({
                message: 'Cannot get data.Server ran into some error'
            })
        }else{
            if(response.statusCode==200)
            {
                res.send({message : 'added successfully'})
            }else{
                res.status(404).send({
                    message: "Something is wrong in adding a task"
                })
            }
        }
    })
})

app.post('/addToDoforAll' , authenticate,isAdmin,(req,res,next)=> {
    var onboardDetails=req.body

    var url=`${process.env.APIENDPOINT}/onboarding/task/forAll`
    request.post({
        headers: {'content-type' : 'application/json'},
        url : url,
        body : JSON.stringify(onboardDetails)
    },(error,response,body)=>{
        if(error)
        {
            // console.log('error in add task for all' ,error)
            res.status(404).send({
                message: 'Cannot get data.Server ran into some error'
            })
        }else{
            if(response.statusCode==200)
            {
                res.send({message : 'added successfully'})
            }else{
                res.status(404).send({
                    message: "Something is wrong in adding a task for all"
                })
            }
        }
    })
})

//make a course
app.get('/adminGetCourses', authenticate, isAdmin,(req,res,next)=> {
    var url=`${process.env.APIENDPOINT}/course/courses/all`
    request.get({
        url : url
    },(err,response,body)=> {
        if(err)
        {
            res.status(404).send({
                message: 'Cannot get data.Server ran into some error'
            })
        }else{
           if(response.statusCode==200){ 
            var output=JSON.parse(response.body)
            var allCourses=output.courses
            res.send({'allCourses' : allCourses})
        }else{
            res.status(404).send({
                message: "Something is wrong with viewing the courses"
            })
        }
        }
    })
})
app.post('/adminAddCourse' ,authenticate, isAdmin,(req,res,next)=> {
    var courseDetails=req.body

    var url=`${process.env.APIENDPOINT}/course/add/course`
    request.post({
        headers: {'content-type' : 'application/json'},
        url : url,
        body : JSON.stringify(courseDetails)
    },(error,response,body)=>{
        if(error)
        {
            // console.log('error in add task for all' ,error)
            res.status(404).send({
                message: 'Cannot get data.Server ran into some error'
            })
        }else{
            if(response.statusCode==200)
            {
                res.send({message : 'added successfully'})
            }else{
                res.status(404).send({
                    message: "Something is wrong in adding a course"
                })
            }
        }
    })
})
//add a new course for a designation
app.post('/adminCourseDesignation' ,authenticate,isAdmin, (req,res,next)=> {
    var courseDetaills=req.body
    var url=`${process.env.APIENDPOINT}/course/designation/course`
    request.post({
        headers: {'content-type' : 'application/json'},
        url : url,
        body : JSON.stringify(courseDetaills)
    },(error,response,body)=>{
        if(error)
        {
            // console.log('error in add task for all' ,error)
            res.status(404).send({
                message: 'Cannot get data.Server ran into some error'
            })
        }else{
            if(response.statusCode==200)
            {
                res.send({message : 'added successfully'})
            }else{
                res.status(404).send({
                    message: "Something is wrong in adding a course for a designation"
                })
            }
        }
    })
})



app.listen(process.env.PORT_SERVICE_ADMIN || 7902, ()=> {
    console.log(`Admin service started on ${process.env.PORT_SERVICE_ADMIN}`)
})


module.exports=app


