import {
    Box,
    Container,
    Grid
  } from '@material-ui/core';
  import AccountProfile from '../components/AccountProfile';
  import AccountProfileDetails from '../components/AccountProfileDetails'
  import TaskProgress from "../components/TaskProgress"
  import ToDoList from '../components/toDoList'
  import Slideshow from '../components/Slideshow';
  import Login from './Login';
  import {useEffect, useState} from 'react'
  import server from '../keys';

  const Account = () => {
    function getDate(today){
      var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = dd + '/' + mm + '/' + yyyy;
    return today
    }
    const [isupdated,setupdated]=useState(false)
    const [details,setDetails]=useState(null)
    const [isdetails,setisdetails]=useState(false)
  const myHeaders=new Headers({
    'Authorization': `Bearer ${localStorage.getItem('tokenId')}`,
  });
  useEffect(()=> {
    fetch(`${server.url}empDashboard/${localStorage.getItem('empId')}`,{
      headers:myHeaders
    })
    .then(response => response.json())
    .then(data =>{
      console.log('employee details',data.emp)
      setDetails(data.emp)
    })
    setisdetails(false)
   },[isdetails])
   console.log('details printed',details)
   return ( <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth="lg">
        <h2> Telstra On-Boarding Page </h2>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={4}
              md={6}
              xs={12}
            >
              <AccountProfile details={details?.courseEmp}/>
            </Grid>
            <Grid
              item
              lg={8}
              md={6}
              xs={12}
            >
              <AccountProfileDetails details={details?.courseEmp} />
            </Grid>
          </Grid>
        </Container>
        <Container className="progress">
        <h2> On-Boarding Progress </h2>
              <h3 style={{"color": "red"}}>
              Due Date: {getDate(new Date(new Date(details?.courseEmp.doj).getTime() + 86400000 * 15))}
              </h3>
          <TaskProgress courses={details?.courseEmp.courseID} tasks={details?.tasks.steps} isdetails={isdetails} />
        </Container>
        <Container className="toDoList">
          <ToDoList tasks={details?.tasks.steps} setisdetails={setisdetails}/>
        </Container>
        <Container>
        <h2> Assigned Courses </h2>
          <Slideshow courses={details?.courseEmp.courseID} setisdetails={setisdetails} isdetails={isdetails}  />
        </Container>
        {/* <Container>
          <Login />
        </Container> */}
      </Box>
    </>
   )
  };
  
  export default Account;
