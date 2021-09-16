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

const AddNewToDo = (props) => {
  const [values, setValues] = useState({
    taskName: '',
    'Is Complteted': false,
    date: "15 days from Date Of Joining",
    designation: 'Select Designation'
  });

  const [message,setMessage]=useState('')
  const [severity,setSeverity]=useState('')
  const [openHandle,setOpenHandle]=useState(false)
  const [isupdated,setupdated]=useState(false)

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };
  const myHeaders = new Headers({
    'Authorization': `Bearer ${localStorage.getItem('tokenId')}`,
    'Content-type' : 'application/json'
});
  function sendNewToDo(){
    var requestOptions={
      method:'POST',
      headers:myHeaders,
      body:JSON.stringify({
        tasks:[{'id':values.taskName}],
        designation: values.designation
      })
  }
  
 // console.log(values.designation)
 if(values.designation === 'Select Designation' || values.designation === 'Mandatory Task'){
  
  fetch(`${server.url}addToDoforAll`,requestOptions)
  .then((response)=>response.json())
  .then((data)=>{
    if(data.message.length>0)
    {
      setMessage('Updated Successfully')
      setSeverity('success')
      setOpenHandle(true)
    }else{
      setMessage('Sorry unable to make a request at this moment')
      setSeverity('error')
      setOpenHandle(true)
    }
    // window.location.reload()
    
  })}
  else{
    fetch(`${server.url}addToDo`,requestOptions)
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
  // window.location.reload()

  })
  setMessage('')
  }
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
          title="Assign Onboarding Task"
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
                label="Task name"
                name="taskName"
                onChange={handleChange}
                required
                value={values.taskName}
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
                label="Is Completed"
                name="Is Complteted"
                onChange={handleChange}
                disabled
                value={values['Is Complteted']}
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
                label="Date"
                name="date"
                onChange={handleChange}
                disabled
                value={values.date}
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
                label="Select Designation"
                name="designation"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.state}
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
            onClick={sendNewToDo}
          >
            Add task
          </Button>
        </Box>
      </Card>
    </form>
    </div>
  );
};

export default AddNewToDo;