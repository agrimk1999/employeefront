import {Box, Container} from '@material-ui/core';
  import AddCourse from '../components/AddCourse'
  
  const NewCourse = () => (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth="lg">
              <AddCourse />
        </Container>
      </Box>
    </>
  );
  
  export default NewCourse;
