import { IconButton, Stack } from "@mui/material";
import Applayout from "../components/layout/Applayout";
import { Fragment, useRef } from "react";
import { AttachFile as AttachFileIcon, Send as SendIcon } from "@mui/icons-material";


const Chat = () => {
  const containerRef = useRef(null)
  return (
   <Fragment>
     <Stack sx={{
      overflowX:"hidden",
      overflowY:"auto"
     }} ref={containerRef} boxSizing={"border-box"} padding={"1rem"} height={"90%"}  bgcolor={"grey"} spacing={"1rem"} > 

</Stack>
   <form style={{
    height:"10%"
   }} >
  <Stack>
  <IconButton>
    <AttachFileIcon />
  </IconButton>
  <InputBox />
  <IconButton >
    <SendIcon />
  </IconButton>
  </Stack>
   </form>
   </Fragment>
  )
}

const WrappedHome = Applayout(Chat);
export default WrappedHome;
