
/*import { IconButton, Stack, Box } from "@mui/material";
import Applayout from "../components/layout/Applayout";
import { Fragment, useRef, useState } from "react";
import { AttachFile as AttachFileIcon, Send as SendIcon } from "@mui/icons-material";
import { InputBox } from "../components/style/StyleComponenet"; // ✅ Ensure this path is correct
// import FileMenu from "../components/dialogs/FileMenu"; // ✅ Ensure this path is correct
import MessageComponenet from "../components/shared/MessageComponenet"; // ✅ Ensure this path is correct
// import { samplemessage } from "../components/shared/MessageComponenet"; // ✅ Ensure this path is correct
import { useSocket } from "../Socket";
import { useParams } from "react-router-dom";
import { NEW_MESSAGE } from "../../../backend/src/helpers/events";
import { useSocketEvents } from "../hooks/Hook";
import { useGetMessagesQuery } from "../store/api/api";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setFileOpen } from "../store/slices/authSlice";

import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import { useSelector } from "react-redux";
import AudioIcon from "@mui/icons-material/AudioFile";
import ImageIcon from "@mui/icons-material/Image";
import VideoIcon from "@mui/icons-material/VideoFile";
import { UploadFile } from "@mui/icons-material";
import { useSendAttachmentsMutation } from "../store/api/api";

const FileMenu = ({ anchorE1 }) => { 
  const  data  = useSelector((state) => state.auth);
  console.log(data.isFileOpen)
  const dispatch = useDispatch();
  const closeFileMenu = () => {
    dispatch(data.isFileOpen(false));
  };

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const vedioRef = useRef(null);
  const fileRef = useRef(null);

  const selecetImage = ()=>{
    imageRef.current.click();
    closeFileMenu();
  };
  const selecetAudio = () => {
    audioRef.current.click();
    closeFileMenu();
  };
  const selecetVedio = () => {
    vedioRef.current.click();
    closeFileMenu();
  };
  const selecetFile = () => {
    fileRef.current.click();
    closeFileMenu();
  };

  const [sendAttachemnt] = useSendAttachmentsMutation();

  const fileChangeHandler = async(e, key) => {
    const files = e.target.files;
    console.log("Files", files);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(key, files[i]);
    }
    console.log("Form Data", formData);

    const res = await sendAttachemnt(formData);
  };
  return (
    <Menu anchorEl={anchorE1} onClose={closeFileMenu} open={data.isFileOpen}>
      <div style={{ width: "10rem" }}>
        <MenuList>
          <MenuItem onClick={selecetImage}>
            <Tooltip title="image">
              <ImageIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input
              ref={imageRef}
              onChange={(e) => fileChangeHandler(e, "Images")}
              type="file"
              style={{ display: "none" }}
              multiple
              accept="image/png, image/jpeg, image/gif"
            />
          </MenuItem>

          <MenuItem onClick={selecetAudio}>
            <Tooltip title="audio">
              <AudioIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              ref={audioRef}
              onChange={(e) => fileChangeHandler(e, "Audios")}
              type="file"
              style={{ display: "none" }}
              multiple
              accept="audio/mpeg audio/wav audio/ogg"
            />
          </MenuItem>

          <MenuItem onClick={selecetVedio}>
            <Tooltip title="video">
              <VideoIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Vedio</ListItemText>
            <input
              ref={vedioRef}
              onChange={(e) => fileChangeHandler(e, "Vedios")}
              type="file"
              style={{ display: "none" }}
              multiple
              accept="video/mp4 video/webm video/ogg"
            />
          </MenuItem>

          <MenuItem onClick={selecetFile}>
            <Tooltip title="file">
              <UploadFile />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
            <input
              ref={fileRef}
              onChange={(e) => fileChangeHandler(e, "Files")}
              type="file"
              style={{ display: "none" }}
              multiple
              accept="*"
            />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};





const Chat = () => {
  
  const containerRef = useRef(null);
  //get the route 
  const {id } = useParams();
  console.log("Chat ID from URL:", id);

  const dispatch = useDispatch();

  const [messages,setMessages] = useState([]);
  const [page,setPage] = useState(1);
  const [fileMenuAnchor,setFeileMenuAnchor] = useState(null);
  
  const socket = useSocket();
  console.log("Socket initialized", socket);
  
  const oldMessageChunk = useGetMessagesQuery({
    chatId: id,
    page
  })
  
  const errors = {
    isError:oldMessageChunk?.isError,
    error:oldMessageChunk?.error,
  }
  
 

  

  // console.log("Messages",messages);


  // console.log("Old Message Chunk",oldMessageChunk.data.data.totalPages);
  // console.log("ss",oldMessageChunk.data.data.data.totalPages)
  const {data:oldMessages,setData:setOldMessages} = useInfiniteScrollTop(containerRef, oldMessageChunk?.data?.data?.totalPages,page,setPage, 
    oldMessageChunk?.data?.data?.data
   );
   
  console.log("Old Messages",oldMessages);
  const allMessages = [...oldMessages, ...messages];
  console.log("All Messages",allMessages);
  const newMessageHandler = (data) => {
    // Check if the message belongs to the current chat
    setMessages((prevMessages) => [...prevMessages, data.message]);
    
  };

  const eventHandler = {
    [NEW_MESSAGE]: newMessageHandler,
  }

  useSocketEvents(socket, eventHandler);
  
  const [message, setMessage] = useState("");
  
 
  if (!socket) {
    console.error("Socket not initialized");
    return null; // or some fallback UI
  }
  // console.log("Socket initialized", socket);
  // Listen for NEW_MESSAGE event

  const sendMessageHandler = (event) => {
    event.preventDefault(); // Prevent page reload on form submission
    if(!message) return; // Prevent sending empty messages
    socket.emit('NEW_MESSAGE', {
      chatId:id, // Replace with actual chat ID
      message: message, // Replace with actual message content
    });
    setMessage(""); // Clear the input field after sending
    console.log("Message Sent");
  };

  const handleFileOpen = (e) => {
    e.preventDefault();
    setFeileMenuAnchor(e.currentTarget);
    dispatch(setFileOpen(true));
  }

 

  return (
    <Fragment>
      
      <Stack
        ref={containerRef}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
          boxSizing: "border-box",
          padding: "1rem",
          height: "90%",
          bgcolor: "grey.100", // ✅ Light gray for better contrast
          borderRadius: "10px",
        }}
        spacing={1}
      >{
        allMessages?.isLoading ? (
          <div>Loading...</div>
        ) : allMessages?.isError ? (
          <div>Error: {oldMessageChunk?.error}</div>
        ) : (
          allMessages?.map((message) => (
            console.log(message),
            <MessageComponenet key={message._id} message={message}  />
          ))
        )
      }
       
      </Stack>




      <form onSubmit={sendMessageHandler} style={{ height: "10%" }}>
        <Stack direction="row" padding="1rem" alignItems="center" spacing={1}>
  
          <IconButton
            sx={{
              color: "primary.light",
              "&:hover": {
                color: "primary.main",
                backgroundColor: "#f2f2f2",
                transform: "scale(1.1)",
                transition: "transform 0.3s ease-in-out",
              },
            }} 
            onClick={handleFileOpen}

          >
            <AttachFileIcon />
          </IconButton>


          <InputBox onChange={(e)=>setMessage(e.target.value)} value={message} placeholder="Type a message" sx={{ flexGrow: 1 }} />


          <Box ml="auto">
            <IconButton
              type="submit"
              sx={{
                color: "primary.main",
                "&:hover": {
                  color: "primary.light",
                  backgroundColor: "#f2f2f2",
                  transform: "scale(1.1)",
                  transition: "transform 0.3s ease-in-out",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Stack>
      </form>
      <FileMenu anchorE1={fileMenuAnchor} />
      
    </Fragment>
  );
};

const WrappedHome = Applayout(Chat);
export default WrappedHome;



*/