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
// import { v4 as uuid } from "uuid";
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
import { getPublicKey, useGetMessagesQuery, useGetSenderIdQuery, useSendAttachmentsMutation } from "../store/api/api";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import { setFileOpen } from "../store/slices/authSlice";
import { incrementNotification } from "../store/slices/chatSlice";
import {setNewMessageAlert,removeNewMessageAlert}  from "../store/slices/chatSlice" 
import { getKey } from "../db/KeyDB";
import { setPublicKey } from "../store/slices/publicSlice";

const NEW_REQUEST = "NEW_REQUEST";
const NEW_MESSAGE_ALERT = "NEW_MESSAGE_ALERT";
const START_TYPING = "START_TYPING";
const STOP_TYPING = "STOP_TYPING";
const ALERT = "ALERT";

import { encryptAndSign } from "../lib/cryptoutlis";
import * as openpgp from "openpgp";
import axios from "axios"


const getData = async({chatId,page}) =>{
  const data = await axios.get(`http://localhost:8000/api/v1/message/${chatId}?page=${page}`)
  console.log(data);
}




const Chat = () => {
  const { id } = useParams();
  const currentuser = useSelector((state) => state.auth);
  //  console.log("user", currentuser.user._id);
  const dispatch = useDispatch();
  const socket = useSocket();
  const iddata  = useSelector((state) => state.public);
  //  console.log("iddata",iddata['6804ebba878f1c564d2f9cf3'])

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
  const [typingUser, setTypingUser] = useState(null); // null or { name: "", id: "" }

  const  data = getData({chatId:id,page:page})
  const typingTimeoutRef = useRef(null);
  
  // Removed duplicate declaration of typingTimeoutRef
  // console.log(id,page)
  
  const oldMessageChunk = useGetMessagesQuery({
    chatId: id,
    page:page || 1,
  });
   console.log("oldMessageChunk", oldMessageChunk);
  const getIds=  useGetSenderIdQuery(id);
  // console.log("getIds",getIds.data.data.members)
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
  console.log("oldMessages", oldMessages);
  const decryptoldmessage = async (oldMessages) => {
    console.log("oldMessages", oldMessages);
    const privateKeyArmored = await getKey("privateKey"); // Your own private key
    const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
  
    if (privateKey.isDecrypted && !privateKey.isDecrypted()) {
      await privateKey.decrypt(""); // "" if none
    }
   
    const decrypted = [];
  
    for (const msg of oldMessages) {
      try {
        const senderId = msg.sender;
  
        let senderPublicKeyArmored = iddata[senderId];
        if (!senderPublicKeyArmored) {
          senderPublicKeyArmored = await getPublicKey({ userId: senderId });
          dispatch(setPublicKey({ _id: senderId, publicKey: senderPublicKeyArmored }));
        }
  
        const senderPublicKey = await openpgp.readKey({ armoredKey: senderPublicKeyArmored });
  
        const { data: decryptedText, signatures } = await openpgp.decrypt({
          message: await openpgp.readMessage({ armoredMessage: msg.content }),
          decryptionKeys: privateKey,                  // receiver's private key
          verificationKeys: senderPublicKey           // sender's public key
        });
  
        await signatures[0].verified; // Throws if invalid
  
        decrypted.push({
          ...msg,
          content: decryptedText,
        });
        return decrypted;
  
      } catch (err) {
        console.error("❌ Decryption failed for message:", msg, err);
      }
    }
  
    
  };
  let messageded = decryptoldmessage(oldMessages?.data?.data?.data);

  const allMessages = [...messageded, ...messages] ;
  console.log("allMessages", allMessages);
 /*
  const newMessageHandler = (data) => {
    //  console.log("New message:", data);
    if (data?.message?.chat === id) {
      setMessages((prev) => [...prev, data.message]);
    }
    
  };*/
  const getRecipientPrivateKey = async () => {
    const privateKey = await getKey("privateKey");
    // console.log("privateKey", privateKey);
    if (!privateKey) {
      throw new Error("Private key not found");
    }
    return privateKey;
  };
  const newMessageHandler = async (data) => {
     console.log("New message:", data);
    if (data?.message?.chat !== id) return; // Exit early if not the current chat
  
    try {
      const encryptedAndSignedMessage = data.message.content;
      const recipientPrivateKey = await getRecipientPrivateKey();
      //  console.log("recipientPrivateKey", recipientPrivateKey);
      // STEP 1: Load YOUR PRIVATE KEY (recipient's key)
      const privateKey = await openpgp.readPrivateKey({ armoredKey: recipientPrivateKey })
      console.log("privateKey", privateKey);
      if (privateKey.isDecrypted && !privateKey.isDecrypted()) {
        await privateKey.decrypt(""); // "" if none
      }
  // If your key is protected with passphrase, replace "" with it
  
      // STEP 2: Load the ENCRYPTED MESSAGE
      const message = await openpgp.readMessage({
        armoredMessage: encryptedAndSignedMessage,
      });
      console.log("message", message);
  
      // STEP 3: Load the SENDER'S PUBLIC KEY
      if(iddata[data.message.sender] === undefined){
        const publicKey =  getPublicKey({userId:data.message.sender})
        console.log(publicKey)
        const newone = {
          _id:data.message.sender,
           publicKey :publicKey
        }
        dispatch(setPublicKey(newone))
      }

      
      

      const senderPublicKeyArmored = iddata[data.message.sender]
      console.log("senderPublicKeyArmored", senderPublicKeyArmored)
      const senderPublicKey = await openpgp.readKey({ armoredKey: senderPublicKeyArmored });
      console.log("senderPublicKey", senderPublicKey);
      // STEP 4: DECRYPT and VERIFY signature
      const { data: decryptedText, signatures } = await openpgp.decrypt({
        message: await openpgp.readMessage({ armoredMessage: encryptedAndSignedMessage }),
        decryptionKeys: privateKey,                  // receiver's private key
        verificationKeys: senderPublicKey           // sender's public key
      });
      
  
      // STEP 5: Verify signature status
      const { verified, keyID } = signatures[0];
      try {
        await verified; // Throws if signature is invalid
        console.log("✅ Signature is valid. Signed by key ID:", keyID.toHex());
      } catch (err) {
        console.error("❌ Invalid signature!", err);
        return; // Stop here — do not trust the message
      }
  
      // STEP 6: Update UI with decrypted message
      console.log("Decrypted message:", decryptedText);
      setMessages((prev) => [...prev, {
        ...data.message,
        content: decryptedText, // Replace encrypted content with plaintext
      }]);
    
    } catch (err) {
      console.error("🔐 Decryption/Verification failed:", err);
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
    if (data.chatId === id && data.senderId !== currentuser.user._id) {
      setUserIsTyping(true);
      setTypingUser({ name: data.sendername, id: data.senderId });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setUserIsTyping(false);
        setTypingUser(null);
      }, 3000);
    }
  };
  
  const stopTypingHandler = (data) => {
    if (data.chatId === id && data.senderId !== currentuser.user._id) {
      setUserIsTyping(false);
      setTypingUser(null);
    }
  };
  const alertHandler = (data) => {
    const messageForAlert = {
      content:data,
      sender:{
        _id:"234234214nj234234",
        username:"Admin",

      },
      // _id:uuid()
    }

    setMessages((prev) => [...prev, messageForAlert]);
    if (data.chatId === id) {
      dispatch(incrementNotification());
      dispatch(setNewMessageAlert({ chatId: data.chatId }));
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
    [ALERT]: alertHandler
  });

 
  const sendMessageHandler = async(event) => {
    event.preventDefault();
    const privateKey =await getKey("privateKey");
    // console.log(privateKey)
    // const { encryptedMessage, signature } = await signAndEncryptMessage({
    //   message: "Hello, encrypted world!",
    //   senderPrivateKey: ,
    //   receiverPublicKey: ,
    // });
    

    const members = getIds?.data?.data?.members;
    console.log("members", members);
    const encryptedMessages = [];
    for (const member of members) {
      console.log("member", member);
       dispatch(setPublicKey(member))
      // Skip if the member is the current user (no need to encrypt for yourself)
      // if (member._id.toString() === currentuser.user._id) continue;
      
      // 1. Encrypt the message with the member's public key
      const passphrase = ""; // Replace with the passphrase if your private key is encrypted
      const signedMessage = await encryptAndSign(message,member.publicKey,privateKey,passphrase)
  
      // 3. Prepare the payload to send to the backend
      encryptedMessages.push({
        to: member._id,        // Receiver's ID
        from: currentuser.user._id,   // Sender's ID
        chatId: id,        // Chat ID
        encryptedMessage: signedMessage, // Signed encrypted message
      });
    }
  

   console.log("Encrypted messages:", encryptedMessages);
    
    
    // console.log()
    if (!message) return;
    // socket.emit(NEW_MESSAGE, {
    //   chatId: id,
    //   message: message,
    // });
    socket.emit("NEW_GROUP_MESSAGE", {
      messages: encryptedMessages,
    });
    
    setMessage("");
  };

  const messageOnChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
  
    if (socket && newMessage.trim() !== "") {
      if (!iamTyping) {
        socket.emit(START_TYPING, { chatId: id, senderId: currentuser?.user?._id,sendername:currentuser?.user?.username });
        setIamTyping(true);
      }
  
      // Clear existing timeout and set a new one
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit(STOP_TYPING, { chatId: id, senderId: currentuser?.user?._id,sendername:currentuser?.user?.username });

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


  // console.log("ssssty",typingUser)

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

         {userIsTyping && (
           <div>

             {typingUser?.name} is typing...
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