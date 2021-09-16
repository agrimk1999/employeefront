import { useState,useEffect } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Alert from './alertbox';
import server from '../keys';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@material-ui/core';

const designation = [
  {
    value: 'Mandatory Task',
    label: 'Mandatory Task'
  },
  {
    value: 'ASSOCIATE',
    label: 'ASSOCIATE'
  },
  {
    value: 'SOFTWARE',
    label: 'SOFTWARE'
  },
  {
    value: 'SENIOR SOFTWARE',
    label: 'SENIOR SOFTWARE'
  },
  {
      value: 'MANAGER',
      label: 'MANAGER'
    },
    {
      value: 'PRODUCT MANAGER',
      label: 'PRODUCT MANAGER'
    }
];


const AssignCourse = (props) => {

  
  const [Designation, setDesignation] = useState('Mandatory Courses')
const [assignedCourse,setAssigned]=useState([])
const [isupdated,setupdated]=useState(false)
  
  const setDesig=(event)=>{
        setDesignation(event.target.value)
        
  }
  
  
  const handleChange = (event) => {
    var cname=assignedCourse.findIndex(x=>x === event.target.name)
    if(cname>=0){
        assignedCourse.splice(cname,1)
    }
    else{
      var obj={
        'id': event.target.name
      }
        assignedCourse.push(obj)
    }
    
  };
  const [courselist,setCourses]=useState([])
  const [message,setMessage]=useState('')
  const [severity,setSeverity]=useState('')
  const [openHandle,setOpenHandle]=useState(false)
  const myHeaders = new Headers({
    'Authorization': `Bearer ${localStorage.getItem('tokenId')}`
});
  useEffect(() => {
    console.log("from assigncourses useeffect",isupdated)
    // POST request using fetch inside useEffect React hook
    fetch(`${server.url}adminGetCourses`, {
      headers: myHeaders
    })
    .then(response => response.json())
    .then(data =>{
      //console.log(data.allCourses)
      var tempList=[]
      for(let i=0;i<data.allCourses.length;i++){
        var obj={
          courseImage:"Course Image",
          CourseName:data.allCourses[i].courseName,
          weightage:data.allCourses[i].weightage,
          summary:data.allCourses[i].summary,
          
        }
        var index=tempList.findIndex(x=>x.CourseName === obj.CourseName)
        if(index>=0){
          console.log("courses exist")
        }else{
          tempList.push(obj)
        }
      }
      setCourses([...tempList])
    })
    setupdated(false) 
    },[isupdated])

    console.log(courselist)

const myHeaders2=new Headers({
  'Authorization': `Bearer ${localStorage.getItem('tokenId')}`,
  'Content-Type':'application/json'
});
  function sendAssignedCourses(){
    var requestOptions={
      method:'POST',
      headers:myHeaders2,
      body:JSON.stringify({
          designation:Designation,
          courses:assignedCourse
      })
  }
  
 // console.log(values.designation)
 
  
  fetch(`${server.url}adminCourseDesignation`,requestOptions)
  .then((response)=>response.json())
  .then((data)=>{
    if(data.message.length>0)
    {
      if(data.message==='added successfully')
      {
      setMessage('Added Successfully')
      setSeverity('success')
      setOpenHandle(true)
      }else if(data.message==='Unauthorized Access - Not an Admin!')
      {
        setMessage(data.message)
      setSeverity('warning')
      setOpenHandle(true)
      }else{
        setMessage(data.message)
      setSeverity('warning')
      setOpenHandle(true)
      }
    }else{
      setMessage('Sorry unable to make a request at this moment')
      setSeverity('error')
      setOpenHandle(true)
    }
    //window.location.reload()
    setupdated(true) 
  })
  setMessage('')
  }




  return (
    <div>
        {message!==''?<Alert message={message} severity={severity} isClicked={openHandle}></Alert>:null}
    <form
      autoComplete="off"
      noValidate
      {...props}
    >
      <Card>
        <CardHeader
          title="Assign Course"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Select Designation"
                name="designation"
                onChange={setDesig}
                required
                select
                SelectProps={{ native: true }}
                
                variant="outlined"
              >
                {designation.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <FormControl component="fieldset" variant="standard">
        <FormGroup>
            {
                
                 courselist.map((t)=>{
                         return(
                                <FormControlLabel
                                          control={
                                        <Checkbox  onChange={handleChange} name={t.CourseName} />
                                                   }
                                       label={t.CourseName}
                                />
                               )
                                   }
                                ) }
       </FormGroup>  
    </FormControl>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={sendAssignedCourses}
          >
            Assign Courses
          </Button>
        </Box>
      </Card>
    </form>
    </div>
  );
};

export default AssignCourse;