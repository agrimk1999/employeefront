var express=require('express')
var path=require('path')
var cors = require('cors')
const passport = require('passport')
const passportSetup = require('./services/passport');
const keys = require('../config/keys')
const cookieSession = require('cookie-session');
const cookieparser=require('cookie-parser')
const request=require('request')

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

const UserSchema = require('../models/user.model');


var authCheck = (req,res,next)=> {
    // console.log('in authcheck' , req.session)
    if(!req.isAuthenticated()){
        res.redirect('/');
    } else {
        next();
    }
}

var isAuthenticated = (req,res,next)=> {
    console.log('in authenticated' , req.session)
    if(req.user)
    {
        if(req.user.role==1)
        {
            res.redirect('/adminDashboardEmployee')
        }else{
            res.redirect(`/empDashboard/${req.user.empId}`)
        }
    }else{
        next()
    }
}

app.get('/' , isAuthenticated,(req,res,next)=> {
    res.render('home')
})

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}));


app.get('/auth/google/redirect', passport.authenticate('google' , {
    failureRedirect : '/'
}), (req, res) => {
    
    //I will get role here and empId as well
    var user=req.user
    var empId=user.empId
    console.log('req user',user)
    UserSchema.findOne({empId : empId}, (err,result)=> {
        if(err)
        {
            console.log(err)
            res.send('Error in finding')
        }else{
            console.log(result)
            if(!result)
            {
                res.redirect('/employeeLogin')
            }else{
                req.user=result
                //employee dashboard or admin based on role
                if(result.role==1)
                {
                    res.redirect('/adminDashboardEmployee')
                }else {
                res.redirect(`/empDashboard/${empId}`)
                }
            }
        }
    })
});

//add an employee 
//edit the details of an employee
//get all employees
app.get('/adminDashboardEmployee' , authCheck,(req,res,next)=> {
    // res.send('welcome to admi:n dashboard for employees')
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
            res.send({'output' : allUsers})
        }
    })
    
})

app.get('/adminLogout', authCheck,(req, res) => {
    req.logout()
    res.redirect('/')
    
});


app.post('/adminAddEmployee',authCheck,(req,res,next)=> {
    var empDetails=req.body
    var url=`${process.env.APIENDPOINT}/user/employee`
    request.post({
        headers: {'content-type' : 'application/json'},
        url : url,
        body : JSON.stringify(empDetails)
    }, (error,respose,body)=> {
        if(error)
        {
            // console.log('error in add employee' ,error)
            res.send(new Error('error in adding employee'))
        }else{
            res.send({message : 'added successfully'})
        }
    })
})

app.post('/editAnEmployee' ,authCheck, (req,res,next)=> {
    var details=req.body
    var url=`${process.env.APIENDPOINT}/user/employee`
    request.post({
        headers: {'content-type' : 'application/json'},
        url : url,
        body : JSON.stringify(details)
    }, (error,respose,body)=> {
        if(error)
        {
            // console.log('error in add employee' ,error)
            res.send(new Error('error in editing employee'))
        }else{
            res.send({message  : 'edited successfully'})
        }
    })
})
//add a to do task wrt designation
//add a common to do task
app.post('/addToDo' ,authCheck, (req,res,next)=> {
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
            res.send(new Error('error in adding onboarding task'))
        }else{
            res.send({message : 'added successfully'})
        }
    })
})

app.post('/addToDoforAll' , authCheck,(req,res,next)=> {
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
            res.send(new Error('error in adding task for all'))
        }else{
            res.send({message : 'added successfully'})
        }
    })
})

//make a course
app.post('/adminAddCourse' ,authCheck, (req,res,next)=> {
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
            res.send(new Error('error in adding course'))
        }else{
            res.send({message: 'added successfully'})
        }
    })
})
//add a new course for a designation
app.post('/adminCourseDesignation' ,authCheck, (req,res,next)=> {
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
            res.send(new Error('error in adding course designation'))
        }else{
            res.send({message:'added successfully'})
        }
    })
})



app.listen(process.env.PORT_SERVICE || 7901, ()=> {
    console.log(`Admin service started on ${process.env.PORT_SERVICE}`)
})


module.exports=app