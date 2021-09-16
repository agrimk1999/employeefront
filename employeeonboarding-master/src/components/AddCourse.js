import { useState } from 'react';
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
import Alert from './alertbox';
import server from '../keys';

const AddCourses = (props) => {
  const [values, setValues] = useState({
    summary: '',
    courseName: '',
    weightage: '',
    amountCompleted: '0',
    courseID:"",
  });

  
  const [message,setMessage]=useState('')
  const [severity,setSeverity]=useState('')
  const [openHandle,setOpenHandle]=useState(false)

  const handleChange = (event) => {
    setValues({
      ...values,
      courseID:values.courseName.substring(0,1),
      [event.target.name]: event.target.value
    });
  };

  const myHeaders2=new Headers({
    'Authorization': `Bearer ${localStorage.getItem('tokenId')}`,
    'Content-Type':'application/json'
  });
  function sendCourses(){
    var requestOptions={
      method:'POST',
      headers:myHeaders2,
      body:JSON.stringify(values)
  }
  
  
  fetch(`${server.url}adminAddCourse`,requestOptions)
  .then((response)=>response.json())
  .then((data)=>{
    console.log(data,data.message)
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
   // window.location.reload()
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
          title="Add New Course"
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
                label="Course name"
                name="courseName"
                onChange={handleChange}
                required
                value={values.courseName}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Weightage"
                name="weightage"
                onChange={handleChange}
                required
                value={values.weightage}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Summary"
                name="summary"
                onChange={handleChange}
                required
                value={values.summary}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Course ID"
                name="courseID"
                onChange={handleChange}
                value={values.courseName.substring(0,1)}
                variant="outlined"
              />
            </Grid>
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
            onClick={sendCourses}
          >
            Add New Course
          </Button>
        </Box>
      </Card>
    </form>
    </div>
  );
};

export default AddCourses;