
import {Face,AlternateEmail,CalendarMonth} from "@mui/icons-material"


import { Avatar, Stack, Typography } from '@mui/material';
import moment from "moment"
import React from 'react';
const Profile = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white"
        }}
      />
      <Profilecard heading = {"bio"} text = {"randim sa"} />
        <Profilecard Icon = {<AlternateEmail />} heading = {"Username"} text = {" prajapti_15"} />
        <Profilecard Icon={<Face />}  heading = {"Name"} text = {"DEviLAL"} />
        <Profilecard Icon={<CalendarMonth />} heading={"Joined"}  text = {moment('2025-02-15').fromNow()}  />
    </Stack>
  );
};

const Profilecard = ({ text, icon, heading }) => (
  <Stack direction="row" alignItems="center" spacing="1rem" color="white" textAlign="center">
    {icon && React.createElement(icon)}
    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography color="gray" variant="caption">{heading}</Typography>
    </Stack>
  </Stack>
);

export default Profile;
