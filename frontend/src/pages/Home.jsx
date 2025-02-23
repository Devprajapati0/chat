
import { Typography } from "@mui/material";
import Applayout from "../components/layout/Applayout";

const Home = () => {
  return (
    <Typography p={"2rem"} variant="h5" textAlign={"center"} > Select a friend to chat</Typography>
  )
};

// Wrap Home with Applayout
const WrappedHome = Applayout(Home);
export default WrappedHome;
