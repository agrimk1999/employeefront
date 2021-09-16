// import moment from 'moment';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@material-ui/core';
import { useEffect, useState } from 'react';



const myHeaders2=new Headers({
  'Authorization': `Bearer ${localStorage.getItem('tokenId')}`,
  'Content-Type':'application/json'
});

const AccountProfile = ({details}) => {
  const [values,setValues]=useState({
    avatar: '/static/images/avatars/avatar_6.png',
    city: 'Los Angeles',
    jobTitle: 'Senior Developer',
    Firstname: 'Katarina',
    LastName:'smit',
    email:'example@gmail.com',
    dob: '',
    doj : ''
  })
  
  function getDate(today){
    var dd = String(today.getDate()-1).padStart(2, '0');
  var mm = String(today.getMonth()+1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  
  today = dd + '/' + mm + '/' + yyyy;
  return today
  }
  useEffect(()=> {
    
              setValues({
                ...values,
                Firstname:details?.firstName,
              LastName:details?.lastName,
              jobTitle:details?.designation,
              email:details?.email,
              city:details?.address,
              dob:details?.dob,
              doj:details?.doj,
              })
  },[details])
  return (<div>
    <Card {...details}>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Avatar
          src={values.avatar}
          sx={{
            height: 100,
            width: 100
          }}
        />
        <Typography
          color="textPrimary"
          gutterBottom
          variant="h3"
        >
          {`${values.Firstname} ${values.LastName}`}
        </Typography>
        <Typography
          color="textSecondary"
          gutterBottom
          variant="body2"
        >
         { `DOB:${getDate(new Date(values.dob))}`}
        </Typography>
        <Typography
          color="textSecondary"
          gutterBottom
          variant="body2"
        >
          {values.email}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >
          {` ${values.jobTitle},${values.city} `}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >
            {/* incase time is needed */}
          {/* {`${moment().format('hh:mm A')} ${user.timezone}`} */}
        </Typography>
        <Divider />
        <Typography>
          
        </Typography>
      </Box>
    </CardContent>
    <Divider />
  </Card>
  </div>)
  
};

export default AccountProfile;
