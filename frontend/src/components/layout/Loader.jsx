import { Skeleton, Box, Grid, Paper } from '@mui/material';

const Loader = () => {
  return (
    <Grid
      container
      spacing={3}
      p={3}
      height="100vh"
      alignItems="center"
      justifyContent="center"
    >
      {/** 3 Parallel Skeleton Boxes **/}
      {[1, 2, 3].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper
            elevation={5}
            sx={{
              p: 3,
              borderRadius: "20px",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
            }}
          >
            {/* Skeleton Header */}
            <Skeleton
              variant="circular"
              width={60}
              height={60}
              sx={{ margin: "auto", mb: 2 }}
            />

            {/* Skeleton Title */}
            <Skeleton variant="text" width="80%" height={30} sx={{ mx: "auto" }} />

            {/* Skeleton Description */}
            <Skeleton variant="text" width="90%" height={20} sx={{ mx: "auto", mb: 1 }} />
            <Skeleton variant="text" width="70%" height={20} sx={{ mx: "auto", mb: 2 }} />

            {/* Skeleton Image */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={150}
              sx={{ borderRadius: "10px" }}
            />

            {/* Skeleton Button */}
            <Box display="flex" justifyContent="center" mt={3}>
              <Skeleton variant="rounded" width="50%" height={40} />
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Loader;
