var express=require('express')
var path=require('path')
var cors = require('cors')
const passport = require('passport')
const passportSetup = require('./services/passport');
const request=require('request')

require('../config/database')

var app=express()

app.use(express.static(path.join(__dirname,'/public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.set('view engine' , 'jade')

app.use(passport.initialize());
app.use(passport.session());

const UserSchema = require('../models/user.model')
//main is authentication for admin as well using email and password fields for admin login
//passport local strategy or jwt
//do this after all making all routes


app.get('/' , (req,res,next)=> {
    res.render('home')
})

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}));


app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    
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
app.get('/adminDashboardEmployee' , (req,res,next)=> {
    // res.send('welcome to admi:n dashboard for employees')
    var url='http://localhost:8080/user/all/employees'
    request.get({
        url : url
    }, (error,response,body)=> {
        if(error){
            console.log('error in admin user', error)
            res.send('Cant get users')
        }else{
           
            var output=JSON.parse(response.body)
            var allUsers=output.allemp
            res.send({'output' : allUsers})
        }
    })
    
})

app.post('/adminAddEmployee',(req,res,next)=> {
    var empDetails=req.body
    var url='http://localhost:8080/user/employee'
    request.post({
        headers: {'content-type' : 'application/json'},
        url : url,
        body : JSON.stringify(empDetails)
    }, (error,respose,body)=> {
        if(error)
        {
            console.log('error in add employee' ,error)
        }else{
            res.send('added successfully')
        }
    })
})

app.post('/editAnEmployee' , (req,res,next)=> {
    var details=req.body.details
    var url='http:localhost:8080/user/employee'
    request.post({
        headers: {'content-type' : 'application/json'},
        url : url,
        body : JSON.stringify(empDetails)
    }, (error,respose,body)=> {
        if(error)
        {
            console.log('error in add employee' ,error)
        }else{
            res.send('added successfully')
        }
    })
})
//add a to do task wrt designation
//add a common to do task

//make a course
//add a new course for a designation


app.listen(7901,()=> {
    console.log('Admin server has started')
})