import {
    Box,
    Container,
    Grid
  } from '@material-ui/core';
  import AddNewToDo from '../components/AddNewToDo'
  import AssignCourse from '../components/AssignCourse';
  const Account = () => (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={12}
              md={6}
              xs={12}
            >
              <AddNewToDo />
            </Grid>
            <Grid
              item
              lg={12}
              md={6}
              xs={12}
            >
              <AssignCourse />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
  
  export default Account;