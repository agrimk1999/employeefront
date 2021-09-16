import {Box, Container} from '@material-ui/core';
  import RegisterProfile from '../components/RegistrationProfile'
  
  const Registration = () => (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth="lg">
              <RegisterProfile />
        </Container>
      </Box>
    </>
  );
  
  export default Registration;
