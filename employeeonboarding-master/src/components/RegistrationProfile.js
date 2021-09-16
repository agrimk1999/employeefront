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
const myHeaders = new Headers({
  'Authorization': `Bearer ${localStorage.getItem('tokenId')}`,
  'Content-Type':'application/json'

});

const RegistrationProfile = (props) => {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    empId:"",
    designation: "",
    dob: '',
    doj: new Date(),
    role: '0'
  });
  const [Designation, setDesignation] = useState('Mandatory Courses')
  const setDesig=(event)=>{
    setDesignation(event.target.value)
    
}
const [message,setMessage]=useState('')
  const [severity,setSeverity]=useState('')
  const [openHandle,setOpenHandle]=useState(false)
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };
function getDate(today){
  var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;
return today
}
function sendEmployee(){
  var requestOptions={
    method:'POST',
    headers: myHeaders,
    body:JSON.stringify(values)
}


fetch(`${server.url}adminAddEmployee`,requestOptions)
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
          title="Register New User"
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
                label="First name"
                name="firstName"
                onChange={handleChange}
                required
                value={values.firstName}
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
                label="Last name"
                name="lastName"
                onChange={handleChange}
                required
                value={values.lastName}
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
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                value={values.email}
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
                label="Address"
                name="address"
                onChange={handleChange}
                type="text"
                value={values.phone}
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
                label="Employee ID"
                name="empId"
                onChange={handleChange}
                required
                value={values.empId}
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
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                name="dob"
                onChange={handleChange}
                required
                value={values.dob}
                type="date"
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
                label="Date Of Joining"
                name="doj"
                onChange={handleChange}
                disabled
                value={getDate(values.doj)}
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
              onClick={sendEmployee}
            >
              Register User
            </Button>
        </Box>
      </Card>
    </form>
    </div>
  );
};

export default RegistrationProfile;