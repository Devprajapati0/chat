import {
  IconButton,
  Stack,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Menu
} from "@mui/material";
import Applayout from "../components/layout/Applayout";
import { Fragment, useRef, useState, useEffect, useCallback } from "react";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon
} from "@mui/icons-material";
import { InputBox } from "../components/style/StyleComponenet";
import MessageComponenet from "../components/shared/MessageComponenet";
import { useSocket } from "../Socket";
import { useParams } from "react-router-dom";
import { NEW_MESSAGE } from "../../../backend/src/helpers/events";
import { useSocketEvents } from "../hooks/Hook";
import { useGetMessagesQuery, useSendAttachmentsMutation } from "../store/api/api";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import { setFileOpen } from "../store/slices/authSlice";
import { incrementNotification } from "../store/slices/chatSlice";
import {setNewMessageAlert,removeNewMessageAlert}  from "../store/slices/chatSlice" 

const NEW_REQUEST = "NEW_REQUEST";
const NEW_MESSAGE_ALERT = "NEW_MESSAGE_ALERT";
const START_TYPING = "START_TYPING";
const STOP_TYPING = "STOP_TYPING";
const Chat = () => {
  const { id } = useParams();
  const authone = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const socket = useSocket();

  const containerRef = useRef(null);
  const imageRef = useRef();
  const videoRef = useRef();
  const audioRef = useRef();
  const docRef = useRef();

  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [filePreview, setFilePreview] = useState(null);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [fileMessage, setFileMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [message, setMessage] = useState("");
  const [iamTyping, setIamTyping] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);

  
  
  
  const oldMessageChunk = useGetMessagesQuery({
    chatId: id,
    page,
  });
  const typingTimeoutRef = useRef(null);
  
  useEffect(() => {
    dispatch(setFileOpen(false));
    dispatch(removeNewMessageAlert({ chatId: id }));
   return () => {
    setMessages([]);
    setOldMessages([]);
    setPage(1);
    clearTimeout(typingTimeoutRef.current);
   }
    
  }, [id]);
  

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessageChunk?.data?.data?.totalPages,
    page,
    setPage,
    oldMessageChunk?.data?.data?.data
  );

  const allMessages = [...oldMessages, ...messages];

  const newMessageHandler = (data) => {
    //  console.log("New message:", data);
    if (data?.message?.chat === id) {
      setMessages((prev) => [...prev, data.message]);
    }
    
  };
  const newRequestHandler = useCallback(() => {
  dispatch(incrementNotification());
  },[dispatch]);

  const newMessageAlertHandler = (data) => {
    if(data.chatId === id) return
    dispatch(setNewMessageAlert( { chatId: data.chatId }));
  }
  const startTypingHandler = (data) => {
    if (data.chatId === id && data.senderId !== authone.user._id) {
      setUserIsTyping(true);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setUserIsTyping(false);
      }, 3000);
    }
  };
  
  const stopTypingHandler = (data) => {
    if (data.chatId === id && data.senderId !== authone.user._id) {
      setUserIsTyping(false);
    }
  };
  

  // console.log("new message", data);
  // console.log("new message", newMessageHandler);

  useSocketEvents(socket, {
    [NEW_MESSAGE]: newMessageHandler,
    [NEW_REQUEST]: newRequestHandler,
    [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
    [START_TYPING]: startTypingHandler,
    [STOP_TYPING]: stopTypingHandler,
  });

 
  const sendMessageHandler = (event) => {
    event.preventDefault();
    if (!message) return;
    socket.emit(NEW_MESSAGE, {
      chatId: id,
      message: message,
    });
    setMessage("");
  };

  const messageOnChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
  
    if (socket && newMessage.trim() !== "") {
      if (!iamTyping) {
        socket.emit(START_TYPING, { chatId: id, senderId: authone?.user?._id });
        setIamTyping(true);
      }
  
      // Clear existing timeout and set a new one
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit(STOP_TYPING, { chatId: id, senderId: authone?.user?._id });

        setIamTyping(false);
      }, 3000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFilePreview({
      file,
      url: URL.createObjectURL(file),
      type: file.type,
    });
    setFileModalOpen(true);
  };

  const [sendAttachment] = useSendAttachmentsMutation();

  const sendFileMessage = async () => {
    const formData = new FormData();
    formData.append("attachments", filePreview.file);
    formData.append("content", fileMessage);
    formData.append("chatId", id);

    // console.log("Sending file:", id, filePreview.file, fileMessage);

   
    const res = await sendAttachment(formData);
    // console.log("File sent:", res);


    //emit socket
    // console.log("File sent to socket:", filePreview.file, fileMessage);
    socket.emit(NEW_MESSAGE, {
      chatId: id,
      message: fileMessage,
      attachments: res?.data?.data?.attachments,
    });

    setFilePreview(null);
    setFileMessage("");
    setFileModalOpen(false);
  };

  return (
    <Fragment>
      {/* Chat Message Container */}
      <Stack
        ref={containerRef}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
          boxSizing: "border-box",
          padding: "1rem",
          height: "90%",
          bgcolor: "grey.100",
          borderRadius: "10px",
        }}
        spacing={1}
      >
        {oldMessageChunk.isLoading ? (
          <div>Loading...</div>
        ) : oldMessageChunk.isError ? (
          <div>Error: {oldMessageChunk.error?.data?.message || "Something went wrong"}</div>
        ) : (
          allMessages.map((message) => (
            <MessageComponenet key={message._id} message={message} />
          ))
        )}
      </Stack>

      {/* Input Box */}
      <form onSubmit={sendMessageHandler} style={{ height: "10%" }}>
        <Stack direction="row" padding="1rem" alignItems="center" spacing={1}>
          {/* Attach File Button */}
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
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <AttachFileIcon />
          </IconButton>

          {/* File Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => { setAnchorEl(null); imageRef.current.click(); }}>Image</MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); audioRef.current.click(); }}>Audio</MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); videoRef.current.click(); }}>Video</MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); docRef.current.click(); }}>Document</MenuItem>
          </Menu>

          {/* Hidden File Inputs */}
          <input type="file" hidden accept="image/*" ref={imageRef} onChange={handleFileChange} />
          <input type="file" hidden accept="audio/*" ref={audioRef} onChange={handleFileChange} />
          <input type="file" hidden accept="video/*" ref={videoRef} onChange={handleFileChange} />
          <input type="file" hidden ref={docRef} onChange={handleFileChange} />

          {/* Input Field */}
          {userIsTyping && (
        <div style={{ fontSize: "12px", color: "gray", marginLeft: "10px" }}>
          User is typing...
        </div>
      )}
          <InputBox
            onChange={messageOnChange}
            value={message}
            placeholder="Type a message"
            sx={{ flexGrow: 1 }}
          />

          {/* Send Button */}
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

      {/* File Preview Dialog */}
      <Dialog open={fileModalOpen} onClose={() => setFileModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Send Attachment</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filePreview?.type?.startsWith("image/") ? (
            <img src={filePreview.url} alt="Preview" style={{ width: "100%", borderRadius: 8 }} />
          ) : filePreview?.type?.startsWith("audio/") ? (
            <audio controls src={filePreview.url} style={{ width: "100%" }} />
          ) : filePreview?.type?.startsWith("video/") ? (
            <video controls src={filePreview.url} style={{ width: "100%" }} />
          ) : (
            <p>File: {filePreview?.file?.name}</p>
          )}
          <TextField
            label="Add a message"
            fullWidth
            value={fileMessage}
            onChange={(e) => setFileMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFileModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={sendFileMessage}>Send</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

const WrappedChat = Applayout(Chat);
export default WrappedChat;
