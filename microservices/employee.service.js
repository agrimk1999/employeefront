const express=require('express')
const cors=require('cors')
const path=require('path')
const request=require('request')
const localStorage=require('localStorage')
const keys = require('../config/keys')
const cookieSession = require('cookie-session');
const cookieparser=require('cookie-parser')
const passport = require('passport')
const passportSetup = require('./services/passport');
const formidable=require('formidable')
const fs=require('fs')

require('../config/database')


var app=express()

app.use(express.static(path.join(__dirname,'/public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieparser())

app.set('view engine' , 'jade')

const UserSchema = require('../models/user.model')
const courseSchema=require('../models/course.model')
app.use(cookieSession({
    keys: [keys.session.cookieKey],
    maxAge: (24*60*60 * 1000)
}));

app.use(passport.initialize());
app.use(passport.session());

var authCheck = (req,res,next)=> {
    // console.log('in authcheck' , req.session)
    if(!req.isAuthenticated()){
        res.redirect('/');
    } else {
        next();
    }
}

var isAuthenticated = (req,res,next)=> {
    // console.log('in authenticated' , req.session)
    if(req.isAuthenticated())
    {
        if(req.user.role==1)
        {
            res.redirect('http://localhost:8080/admin')
        }else{
            res.redirect(`/empDashboard/${req.user.empId}`)
        }
    }else{
        next()
    }
}

app.get('/' , (req,res)=> {
    
    res.render('home', {user : req.user})
})
app.get('/employeeLogout', authCheck,(req, res) => {
    req.logout()
    res.redirect('/')
    
});

// auth with google+
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
                    res.redirect('http://localhost:8080/admin')
                }else {
                res.redirect(`/empDashboard/${empId}`)
                }
            }
        }
    })
});


app.get('/employeeLogin' , isAuthenticated , (req,res,next)=> {
   res.render('Login')
})

app.post('/employeeLogin' , (req,res,next)=> {
    var empId=req.body.empId
    var pass=req.body.password

    res.redirect(`empDashboard/${empId}`)
})

app.get('/empDashboard/:empId' ,authCheck, (req,res,next)=> {
    var empId=req.params['empId']
    var url=`http://localhost:8080/user/${empId}`
    localStorage.setItem('empId' , empId)
    var output = {
        "tasks" : {},
        "courseEmp" : {}
    }
    var status=200
    getRequestToEmployee(empId).then((result)=> {
        // console.log('Promise',result)
        output.courseEmp=result
        getRequestToonBoarding(empId).then((data)=> {
            // console.log('Prromise 2' , data)
            output.tasks={...data}
            // console.log(output)
            // res.render('empDashboard' , {'emp' : output})
            res.send({'emp' : output})
        }).catch((err)=> {
            // console.log('Promise 2', err.message)
            if(err.message=='Error Message : 403')
        {
            res.send('User not found')
        }else{
            res.send('Error in database')
        }
        })
        }).catch((err)=> {
        // console.log('Promise',err.message)
        if(err.message=='Error Message : 403')
        {
            res.send('User not found')
        }else{
            res.send('Error in database')
        }
    })

  

})


app.post('/empUpdateCourses' , authCheck,(req,res,next)=> {
    var empId=localStorage.getItem('empId')
    var checkedSteps=[{
        'name':'JAVA',
        'amountCompleted' : 20
    }
    ]
    var obj={
        "empId" : empId,
        "details" : checkedSteps
    }
    var url = 'http://localhost:8080/course/update'
    request.post({
        headers: {'content-type' : 'application/json'},
        url : url,
        body : JSON.stringify(obj)
    },(err,response,body)=> {
        if(err)
        {
            console.log('error in updating',err)
            res.sendStatus(404)
        }else{
            res.send({message : 'updated succesfully'})
        }
    })
})


app.post('/empUpdateToDo' , authCheck,(req,res,next)=> {
    var empId=localStorage.getItem('empId')
    var checkedSteps=['submit pan']
    var obj={
        "empId" : empId,
        "details" : checkedSteps
    }
    var url = `http://localhost:8080/onboarding/${empId}`
    request.post({
        headers: {'content-type' : 'application/json'},
        url : url,
        body : JSON.stringify(obj)
    },(err,response,body)=> {
        if(err)
        {
            console.log('error in updating',err)
        }else{
            res.send({message : 'updated succesfully'})
        }
    })
})


const isFileValid = (file) => {
    const type = file.type.split("/").pop();
    const validTypes = ["jpg", "jpeg", "png", "pdf"];
    if (validTypes.indexOf(type) === -1) {
      return false;
    }
    return true;
  };

app.post('/uploadProfile' , authCheck , (req,res)=> {
    var form=new formidable.IncomingForm()
    const uploadFolder=path.join(__dirname,'public','images')
    console.log(form)
    form.mutliples=false
form.maxFileSize = 50 * 1024 * 1024; // 5MB
form.uploadDir = uploadFolder;
    form.parse(req, function(error,fields,files){
        console.log(files)
        console.log(fields)
        const file = files.empProfile;
        const isValid = isFileValid(file);
  // creates a valid name by removing spaces
  const fileName = encodeURIComponent(file.name.replace(/\s/g, "-"));

  if (!isValid) {
    // throes error if file isn't valid
    return res.status(400).json({
      status: "Fail",
      message: "The file type is not a valid type",
    });
  }
  try {
    // renames the file in the directory
    fs.renameSync(file.path, path.join(uploadFolder, fileName));
  } catch (error) {
    console.log(error);
  }

  console.log(fileName)
  var empId=localStorage.getItem('empId')
  UserSchema.updateOne({empId : empId} , {
      $set : {
          profilePhoto : `/images/${fileName}`
      }
  }, (err,result)=> {
      if(err)
      {
          console.log(err)
          res.send(err)
      }else{
          console.log(result)
          res.send('Uploaded')
      }
  })
    })
})




async function getRequestToEmployee(empId){
    var url=`http://localhost:8080/user/${empId}`
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
                // console.log('Promise function' , emp)
                resolve(emp)
                }
    
    
            }
    
        })
    })
}

async function getRequestToonBoarding(empId){
    var url=`http://localhost:8080/onboarding/${empId}`
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
                // console.log('Promise function' , emp)
                resolve(emp)
                }
    
    
            }
    
        })
    })
}

app.listen(7901, ()=> {
    console.log('Employee service started')
})

module.exports=app