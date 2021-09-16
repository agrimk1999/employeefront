const app=require('./employee.service')
const mongoose=require('mongoose')
const supertest=require('supertest')
const User=require('../models/user.model')
const onBoard=require('../models/onboarding.model')
const Course=require('../models/course.model')


let empuser={
    firstName : 'Ayush',
    lastName : 'Sonthalia',
    empId : 'EMP002',
    courseID : [
        {
            id : 'JAVA',
            amountCompleted : 0
        },
        {
            id : 'C++',
            amountCompleted : 0
        },
        {
            id : 'C',
            amountCompleted : 0
        }
    ],
    address : 'Bangalore',
    dob : '04-05-1999',
    designation : 'Software',
    email : 'agrim112551981@gmail.com',
    googleId : '1234',
    role : 0
}

let updateCourses={
    "steps":[
        {
            "id":"JAVA",
            "amountCompleted":20
        },
        {
            "id":"C",
            "amountCompleted":10
        }
    ]
}

let updateTasks={
    "tasks": [
        {
            "id": "SUBMIT PAN",
        }
    ]
}

let userTemp={
    firstName : 'Ramu',
    lastName : 'Sharma',
    empId : 'EMP004',
    courseID : [
        {
            id : 'JAVA',
            amountCompleted : 0
        },
        {
            id : 'C++',
            amountCompleted : 0
        },
        {
            id : 'C',
            amountCompleted : 0
        }
    ],
    address : 'Gujarat',
    dob : '04-07-1999',
    designation : 'Associate',
    email : 'rsharma@gmail.com',
    googleId : '1234564',
    role : 0
}

let onboardUser={
    empId : "EMP002",
    designation_id : "S",

    designation : "Software",

    steps : [
        {
       id : "SUBMIT PAN",
       isCompleted : false
    }, {
        id : 'Laptop',
        isCompleted : false
    }]
}


let user={
    firstName : 'Agrim',
    lastName : 'Khurana',
    empId : 'EMP001',
    address : 'Indore',
    dob : '04-05-1999',
    designation : 'Manager',
    email : 'agrimkh54321@gmail.com',
    googleId : '1234',
    role : 1
}

let notAdminUser={
    firstName : 'Agrim',
    lastName : 'Khurana',
    empId : 'EMP001',
    address : 'Indore',
    dob : '04-05-1999',
    designation : 'Manager',
    email : 'agrimkh54321@gmail.com',
    googleId : '1234',
    role : 0
}

let users=[
    { 
        firstName : 'Ayush',
        lastName : 'Sonthalia',
        empId : 'EMP002',
        courseID : [
            {
                id : 'JAVA',
                amountCompleted : 0
            },
            {
                id : 'C++',
                amountCompleted : 0
            },
            {
                id : 'C',
                amountCompleted : 0
            }
        ],
        address : 'Bangalore',
        dob : '04-05-1999',
        designation : 'Software',
        email : 'asonthalia@gmail.com',
        googleId : '1234',
        role : 0
    },
   { 
    firstName : 'Raju',
    lastName : 'Sharma',
    empId : 'EMP003',
    courseID : [
        {
            id : 'JAVA',
            amountCompleted : 0
        },
        {
            id : 'C++',
            amountCompleted : 0
        },
        {
            id : 'C',
            amountCompleted : 0
        }
    ],
    address : 'Indore',
    dob : '04-06-1999',
    designation : 'Associate',
    email : 'rsha@gmail.com',
    googleId : '123456',
    role : 0
   }

]

let updateUser={
    firstName : 'Ayush',
        lastName : 'Sharma',
        empId : 'EMP002',
        courseID : [
            {
                id : 'EXCEL',
                amountCompleted : 0
            }
        ],
        address : 'Bangalore',
        dob : '04-05-1999',
        designation : 'Associate',
        email : 'asonthalia@gmail.com',
        googleId : '1234',
        role : 0
    
}

let onBoardTask={
    designation : 'Software',
    tasks : [
        {
            id : 'submit pan',
            isCompleted : 0
        },
        {
            id : 'laptop',
            isCompleted : 0
        }
    ]
}

let taskforAll = {
    tasks : [
        {
            id : 'submit pan',
            isCompleted : false
        },
        {
            id : 'laptop',
            isCompleted : false
        }
    ]
}

let courseAll=[
    {
        courseID : 'J',
        courseName : 'JAVA',
        summary : 'Learn Java',
        weightage : 30
    },{
        courseID : 'C',
        courseName : 'C',
        summary : 'Learn C',
        weightage : 10
    },
    {
        courseID : 'E',
        courseName : 'EXCEL',
        summary : 'Learn Excel',
        weightage : 20
    }
]

let courseDesignation= {
    designation : 'Software',
    courses : [
        {
            id : 'PYTHON',
            amountCompleted : 0
        },
        {
            id : "REDUX",
            amountCompleted : 0
        }
    ]
}

let courses = [
    {
        courseID : 'J',
        courseName : 'Java',
        summary : 'Do Java Course',
        weightage : 30
    },
    {
        courseID : 'C',
        courseName : 'C',
        summary : 'Do C Course',
        weightage : 10
    },
    {
        courseID : 'R',
        courseName : 'REDUX',
        summary : 'Do REDUX Course',
        weightage : 30
    },
    {
        courseID : 'C++',
        courseName : 'C++',
        summary : 'Do C++ Course',
        weightage : 40
    },
    {
        courseID : 'P',
        courseName : 'Python',
        summary : 'Do Python Course',
        weightage : 25
    },
    {
        courseID : 'NE',
        courseName : 'Node Express',
        summary : 'Do Node and Express Course',
        weightage : 50
    }
]


let wrongCourse= {
    "course": "Not a valid coourse"
}


beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
      { useNewUrlParser: true, useUnifiedTopology: true }, ()=> {
          done()
      })

    
      
  });
  
  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => {
          done()
        })
    });
    
  });



 let token1='eyJhbGciOiJIUzI1NiJ9.YWdyaW1raDU0MzIxQGdtYWlsLmNvbQ.lA8bDKiqXAoMIlSam7dQBqwVfYtVfhoD1o5MALiBVbA'
 let token2='eyJhbGciOiJIUzI1NiJ9.YWdyaW0xMTI1NTE5ODFAZ21haWwuY29t.fCyHjjdxIAD0mlBCK6nsQTJaiwIQeQOFVhKt8up9ouw'
let token3='eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFncmltay5pYy4xN0Buc2l0Lm5ldC5pbiJ9.ensyspOOkoBMJPirxT-yuEN_WhDwZUF2Dpr8LO0tP1U'

test('Get Employee Dashboard' , async ()=> {
     await User.create({...empuser}).then(async ()=> {
       await onBoard.create({...onboardUser}).then(async ()=> {
           await supertest(app).get(`/empDashboard/${empuser.empId}`)
           .set('Authorization',"Bearer "+token2)
           .expect(200)
           .then((response)=> {
             //   console.log(response.body)
               expect(response.body.emp.courseEmp.firstName).toBe('Ayush')
               expect(response.body.emp.courseEmp.lastName).toBe('Sonthalia')
               expect(response.body.emp.courseEmp.empId).toBe('EMP002')
               expect(response.body.emp.courseEmp.role).toBe(0)
       })
     })
    
    
     })
 })


 test('POST Update Employee Course' , async ()=> {
     await User.create({...empuser}).then(async ()=> {
       await supertest(app).post('/empUpdateCourses')
       .set('Authorization',"Bearer "+token2)
       .expect(200)
       .send(updateCourses)
       .then(async (response)=> {
           expect(response.body.message).toBe('added successfully')
           const courseEmp=await User.findOne({empId : empuser.empId})
       expect(courseEmp.courseID[0].amountCompleted).toBe(20)
       expect(courseEmp.courseID[2].amountCompleted).toBe(10)
     })
     
     
     })

     

 })


 test('Error in update course for employee', async ()=> {
    await User.create({...empuser}).then(async ()=> {
        await supertest(app).post('/empUpdateCourses')
        .set('Authorization',"Bearer "+token2)
        .expect(404)
        .send({
            "empId": "something"
        })
        .then(async (response)=> {
            console.log(response.body)
            expect(response.body.message.length).toBe(0)
      })
      
      
      })
 })

 test('Error in update tasks for employee', async ()=> {
    await User.create({...empuser}).then(async ()=> {
        await supertest(app).post('/empUpdateToDo')
        .set('Authorization',"Bearer "+token2)
        .expect(404)
        .send({
            "empId": "something"
        })
        .then(async (response)=> {
            console.log(response.body)
            expect(response.body.message.length).toBe(0)
      })
      
      
      })
 })


 test('POST Update Employee tasks' , async ()=> {
    await User.create({...empuser}).then(async ()=> {
       await onBoard.create({...onboardUser}).then(async ()=> {
           await supertest(app).post('/empUpdateToDo')
           .set('Authorization',"Bearer "+token2)
           .send(updateTasks)
           .expect(200)
           .then(async (response)=> {
               expect(response.body.message).toBe('added successfully')
               const onboardusertemp= await onBoard.findOne({empId : empuser.empId})
         //  console.log(onboardusertemp)
          expect(onboardusertemp.steps[0].isCompleted).toBeTruthy()
       })
    })

    

     })

 })

 
 test('GET Employee Dashboard with no EMPID in database', async ()=> {

   await supertest(app).get('/empDashboard/EMP008')
   .set('Authorization',"Bearer "+token2)
   .expect(401)
 })

 test('GET Employee Dashboard with EMPID in User but not in Onboard', async ()=>{
     User.create({...userTemp})

     await supertest(app).get('/empDashboard/EMP004')
     .set('Authorization',"Bearer "+token2)
     .expect(401)
     
 })

 test('GET all users without token' , async ()=> {
    await User.create({...user})
     await supertest(app).get('/adminDashboardEmployee')
     .expect(401)
     .then((response)=> {
         expect(response.body.message).toBe('Unauthorized Access - No Token Provided!')
     })
 })

 test('GET all users with token1 but is not an admin', async ()=> {
     await User.create({...notAdminUser})
         await supertest(app).get('/adminDashboardEmployee')
         .set('Authorization',"Bearer "+token1)
         .expect(403)
         .then((response)=> {
             expect(response.body.message).toBe('Unauthorized Access - Not an Admin!')
         })
        })


  test('GET All Users for Admin' , async ()=> {
    await User.create({...user})
      await User.insertMany(users)

      await supertest(app).get('/adminDashboardEmployee')
      .set('Authorization',"Bearer "+token1)
      .expect(200)
      .then((response)=> {
        //   console.log(response.body.finalOutput.courseUsers)
          expect(response.body.finalOutput.courseUsers.length).toBe(2)
          expect(response.body.finalOutput.taskUsers.length).toBe(0)
          expect(response.body.finalOutput.courseUsers[0].empId).toBe('EMP002')
          expect(response.body.finalOutput.courseUsers[1].empId).toBe('EMP003')
      })
  })


  test('POST Add an employee' , async ()=> {
    await User.create({...user})
      const tempUser=users[0]
      await supertest(app).post('/adminAddEmployee')
      .set('Authorization',"Bearer "+token1)
      .set('Accept', 'application/json')
      .send(tempUser)
      .expect(200)
      .then(async (response)=> {
          expect(response.body.message).toBe('added successfully')
          let output=await User.findOne({empId : 'EMP002'})
          let onboardOutput=await onBoard.findOne({empId : 'EMP002'})
        //   console.log(output)

          expect(output.firstName).toBe('Ayush')
          expect(onboardOutput.designation).toBe('SOFTWARE')
          
    
      })

     

  })


  test('Admin add an employee error', async ()=> {
    await User.create({...user})
    const tempUser=users[0]
    await supertest(app).post('/adminAddEmployee')
    .set('Authorization',"Bearer "+token1)
    .set('Accept', 'application/json')
    .send({
        "empId": "nothing"
    })
    .expect(404)
    .then(async (response)=> {
        console.log(response.body)
            expect(response.body.message.length).toBe(0)
    })
  })



  test('POST update an employee' , async ()=> {
    await User.create({...user})
    await User.create({...users[0]})
    await onBoard.create({
        designation : 'SOFTWARE',
        designation_id: 'S',
        empId : 'EMP002'
    })
      await supertest(app).post('/editAnEmployee')
      .set('Authorization',"Bearer "+token1)
      .send(updateUser)
      .expect(200)
      .then(async (response)=> {
          expect(response.body.message).toBe('added successfully')
           await User.findOne({empId : 'EMP002'}).then((output)=> {
            expect(output.lastName).toBe('Sharma')
          })
        //   console.log(output)
          

          await onBoard.findOne({empId : 'EMP002'}).then((onboardOutput)=> {
            expect(onboardOutput.designation_id).toBe('A')
            expect(onboardOutput.designation).toBe('ASSOCIATE')
          })
          
      })

     
  })

  
  test('Admin edit an employee error', async ()=> {
    await User.create({...user})
    const tempUser=users[0]
    await supertest(app).post('/editAnEmployee')
    .set('Authorization',"Bearer "+token1)
    .set('Accept', 'application/json')
    .send({
        "empId": "nothing"
    })
    .expect(404)
    .then(async (response)=> {
        console.log(response.body)
            expect(response.body.message.length).toBe(0)
    })
  })



  test('POST add onboarding task', async ()=> {
    await User.create({...user})
      await onBoard.create({
          designation : 'Software',
          empId : 'EMP002',
          designation_id: "S"
      })

      await supertest(app).post('/addToDo')
      .send(onBoardTask)
      .set('Authorization',"Bearer "+token1)
      .expect(200)
      .then(async (response)=> {
          expect(response.body.message).toBe('added successfully')
          const output=await onBoard.find({designation : 'Software'})
          expect(output.length).toBe(1)
          expect(output[0].steps.length).toBe(2)
          expect(output[0].steps[0].isCompleted).toBeFalsy()
      })
  })

  test('Admin add onboarding task error', async ()=> {
    await User.create({...user})
    const tempUser=users[0]
    await supertest(app).post('/addToDo')
    .set('Authorization',"Bearer "+token1)
    .set('Accept', 'application/json')
    .send({
        "empId": "nothing"
    })
    .expect(404)
    .then(async (response)=> {
        console.log(response.body)
            expect(response.body.message.length).toBe(0)
    })
  })


  test('POST onboarding task for all' , async ()=> {
    await User.create({...user})
      await onBoard.insertMany([
          {
            designation : 'Software',
            empId : 'EMP002',
            designation_id: "S"
          },{
            designation : 'Associate',
            empId : 'EMP003',
            designation_id: "A"
          }
      ])

      await supertest(app).post('/addToDoforAll')
      .set('Authorization',"Bearer "+token1)
      .send(taskforAll)
      .expect(200)
      .then(async (response)=> {
          expect(response.body.message).toBe('added successfully')
          const output=await onBoard.find({})
          expect(output.length).toBe(2)
          expect(output[0].empId).toBe('EMP002')
          expect(output[1].empId).toBe('EMP003')
          expect(output[0].steps.length).toBe(2)
          expect(output[1].steps.length).toBe(2)
      })

  })

  test('Admin add onboarding task for all error', async ()=> {
    await User.create({...user})
    const tempUser=users[0]
    await supertest(app).post('/addToDoforAll')
    .set('Authorization',"Bearer "+token1)
    .set('Accept', 'application/json')
    .send({
        "empId": "nothing"
    })
    .expect(404)
    .then(async (response)=> {
        console.log(response.body)
            expect(response.body.message.length).toBe(0)
    })
  })


  test('POST add course' , async ()=> {
    await User.create({...user})
    await supertest(app).post('/adminAddCourse')
    .set('Authorization',"Bearer "+token1)
    .send(courseAll)
    .expect(200)
    .then(async (response)=> {
        expect(response.body.message).toBe('added successfully')
        const output=await Course.find({})
        // console.log(output)
        expect(output.length).toBe(3)
        expect(output[0].courseID).toBe('J')
        expect(output[1].weightage).toBe(10)
        expect(output[2].courseName).toBe('EXCEL')
    })



  })


  test('POST add course error' , async ()=> {
    await User.create({...user})
    await supertest(app).post('/adminAddCourse')
    .set('Authorization',"Bearer "+token1)
    .send(wrongCourse)
    .expect(404)
    .then(async (response)=> {
        console.log(response.body)
        expect(response.body.message.length).toBe(0)
    })
  })

  test('POST add course for designation' , async ()=> {
    await User.create({...user})
      await User.create({...users[0]})
      await User.create({...users[1]})

      await supertest(app).post('/adminCourseDesignation')
      .set('Authorization',"Bearer "+token1)
      .send(courseDesignation)
      .expect(200)
      .then(async (response)=> {
          expect(response.body.message).toBe('added successfully')
          const output=await User.find({designation : 'Software'})
          expect(output.length).toBe(1)
          expect(output[0].courseID.length).toBe(5)
      })
  })
  test('POST add course for designation error' , async ()=> {
    await User.create({...user})
    await supertest(app).post('/adminCourseDesignation')
    .set('Authorization',"Bearer "+token1)
    .send(wrongCourse)
    .expect(404)
    .then(async (response)=> {
        console.log(response.body)
        expect(response.body.message.length).toBe(0)
    })
  })
//   test('POST add course for all designation' , async ()=> {
//     await User.create({...user})
//       await User.create({...users[0]})
//       await User.create({...users[1]})

//       await supertest(app).post('/adminCourseforAll')
//       .set('Authorization',"Bearer "+token1)
//       .send(courseAll)
//       .expect(200)
//       .then(async (response)=> {
//           expect(response.body.message).toBe('added successfully')
//           const output=await User.find({designation : 'Software'})
//           expect(output.length).toBe(1)
//           expect(output[0].courseID.length).toBe(4)
//       })
//   })

  test('GET all courses for admin', async ()=> {
    await User.create({...user})
      await Course.insertMany(courses).then(async (result)=> {
        //   console.log(result)
          await supertest(app).get('/adminGetCourses')
          .set('Authorization',"Bearer "+token1)
          .expect(200)
          .then((response)=> {
              expect(response.body.allCourses.length).toBe(6)
              expect(response.body.allCourses[4].courseName).toBe('PYTHON')
              expect(response.body.allCourses[5].courseName).toBe('NODE EXPRESS')   
              expect(response.body.allCourses[5].weightage).toBe(50)    
               })
      })
  })


test('Admin edit existing course', async ()=> {
    await User.create({...user})
    await Course.create({...courses[0]})
        await supertest(app).post('/adminEditCourse')
        .set('Authorization',"Bearer "+token1)
        .send({course: {
            courseID : 'J',
        courseName : 'JAVA',
        summary : 'Do Java Courses now',
        weightage : 45
        }})
        .expect(200)
      .then(async (response)=> {
          expect(response.body.message).toBe('added successfully')
          const output=await Course.findOne({courseName : 'JAVA'})
        //   console.log(output)
          expect(output.summary).toBe('Do Java Courses now')
          expect(output.weightage).toBe(45)
      })
    })