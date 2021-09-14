const app=require('./employee.service')
const mongoose=require('mongoose')
const supertest=require('supertest')
const User=require('../models/user.model')
const onboard=require('../models/onboarding.model')

let user={
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
       id : "submit pan",
       isCompleted : false
    }, {
        id : 'Laptop',
        isCompleted : false
    }]
}


beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => done());

  });
  
  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done())
    });

  });
let token='eyJhbGciOiJIUzI1NiJ9.YWdyaW0xMTI1NTE5ODFAZ21haWwuY29t.fCyHjjdxIAD0mlBCK6nsQTJaiwIQeQOFVhKt8up9ouw'

  test('Get Employee Dashboard' , async ()=> {
      await User.create({...user}).then(async ()=> {
        await onboard.create({...onboardUser}).then(async ()=> {
            await supertest(app).get(`/empDashboard/${user.empId}`)
            .set('Authorization',"Bearer "+token)
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
      await User.create({...user}).then(async ()=> {
        await supertest(app).post('/empUpdateCourses')
        .set('Authorization',"Bearer "+token)
        .expect(200)
        .then(async (response)=> {
            expect(response.body.message).toBe('updated succesfully')
            const courseEmp=await User.findOne({empId : user.empId})
        expect(courseEmp.courseID[0].amountCompleted).toBe(20)
        expect(courseEmp.courseID[2].amountCompleted).toBe(10)
      })
      
      
      })

      

  })


  test('POST Update Employee tasks' , async ()=> {
     await User.create({...user}).then(async ()=> {
        await onboard.create({...onboardUser}).then(async ()=> {
            await supertest(app).post('/empUpdateToDo')
            .set('Authorization',"Bearer "+token)
            .expect(200)
            .then(async (response)=> {
                expect(response.body.message).toBe('updated succesfully')
                const onboardusertemp= await onboard.findOne({empId : user.empId})
          //  console.log(onboardusertemp)
           expect(onboardusertemp.steps[0].isCompleted).toBeTruthy()
        })
     })

     

      })

  })

  
  test('GET Employee Dashboard with no EMPID in database', async ()=> {

    await supertest(app).get('/empDashboard/EMP008')
    .set('Authorization',"Bearer "+token)
    .expect(401)
  })

  test('GET Employee Dashboard with EMPID in User but not in Onboard', async ()=>{
      User.create({...userTemp})

      await supertest(app).get('/empDashboard/EMP004')
      .set('Authorization',"Bearer "+token)
      .expect(401)
      
  })


  