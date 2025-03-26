import { Add, Delete, Done, KeyboardBackspace } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { Grid, IconButton, Stack, Tooltip, Typography, Drawer, TextField, Button, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, styled } from "@mui/material";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import React, { memo, Suspense, useEffect, useState } from "react";
import PropTypes from "prop-types";
import AvatarCard from "../components/shared/AvatarCard";
import EditIcon from "@mui/icons-material/Edit";
const ConfirmDeleteDialog = React.lazy(() => import("../components/dialogs/ConfirmDeleteDialog"));
const AddMemberDialog = React.lazy(() => import("../components/dialogs/AddMemberDialog"));
const sampleUsers = [
  { avatar: "", name: "dev", _id: "1" },
  { avatar: "", name: "rev", _id: "2" },
];
export const samplemessage = [
  {
    attachment: [
      {
        public_id: "img1",
        url: "https://example.com/sample-image1.jpg",
      },
    ],
    avatar: "https://example.com/avatar1.jpg",
    content: "Hello! How are you?",
    chatId: "1",
    sender: { _id: "1", name: "John" },
    chat: "chat_id",
    createdAt: "2021-09-30T12:00:00.000Z",
  },
  {
    attachment: [
      {
        public_id: "img2",
        url: "https://example.com/sample-image2.jpg",
      },
    ],
    content: "Hey John! I'm good, thanks!",
    chatId: "2",
    sender: { _id: "4", name: "Alice" },
    chat: "chat_id",
    createdAt: "2021-09-30T12:05:00.000Z",
  },
];
import { useRef } from "react";
import UserItem from "../components/shared/UserItem";

const Group = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("Group Name");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("Group Name");
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ Extract chatId from query params
  const chatId = searchParams.get("group");

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group ${chatId}`);
      setGroupNameUpdatedValue(`Group ${chatId}`);
    }

    return () => {
      setGroupNameUpdatedValue("");
      setGroupName("");
      setIsEdit(false);
    };
  }, [chatId]);

  const handleMobileMenuOpen = () => setMobileMenuOpen((prev) => !prev);

  const updateGroupName = () => {
    setGroupName(groupNameUpdatedValue);
    setIsEdit(false);
  };

  const IconBtn = () => (
    <>
      {/* Hamburger Menu */}
      <IconButton
        onClick={handleMobileMenuOpen}
        sx={{
          display: { xs: "block", sm: "none" },
          position: "fixed",
          top: "1rem",
          right: "1rem",
          color: "black",
          backgroundColor: "white",
          zIndex: 100,
          borderRadius: "50%",
          "&:hover": { backgroundColor: "#f5f5f5" },
        }}>
        <MenuIcon />
      </IconButton>

      {/* Back Button */}
      <Tooltip title="Back">
        <IconButton
          sx={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            color: "black",
            backgroundColor: "white",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
          onClick={() => navigate("/home")}>
          <KeyboardBackspace />
        </IconButton>
      </Tooltip>
    </>
  );

  
const GroupName = () => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]); // Focus the input when switching to edit mode

  return (
    <Stack direction="row" padding="3rem" alignItems="center" justifyContent="center" spacing="1rem" sx={{ width: "100%" }}>
      {isEdit ? (
        <>
          <input
            ref={inputRef}
            type="text"
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            style={{
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "1rem",
              width: "100%",
              maxWidth: "300px",
            }}
          />
          <IconButton onClick={updateGroupName}>
            <Done />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4">{groupName}</Typography>
          <IconButton
            onClick={() => setIsEdit(true)}
            sx={{
              color: "black",
              backgroundColor: "white",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}>
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );
};

const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
 const openConfirmDeleteDialog = () => {
  setConfirmDeleteDialog(true);
};
const closeConfirmDeleteDialog = () => {
  setConfirmDeleteDialog(false);
};


const DeleteHandler = () => {
  setConfirmDeleteDialog(true);
  console.log("Delete");
};
const ConfirmHandler = () => {
  console.log("Confirm");
};

const ButtonGroup = (
 <Stack 
 direction={{
    xs: "column-reverse",
    sm: "row",
 }}
 spacing={"1rem"} 
 p={{
  xs:"0",
  sm:"1rem",
  md:"1rem 4rem"
 }}  > 
 <Button onClick={DeleteHandler} startIcon={<Delete />} color="error" size="large" variant="outlined" >Delete</Button>
  <Button onClick={ConfirmHandler} startIcon={<Add />} size="large" variant="contained">Add</Button>
 </Stack>
)

const isAddMember = false;

  return (
    <Grid container height="100vh">
      {/* Sidebar */}
      <Grid item sx={{ display: { xs: "none", sm: "block" } }} sm={4} bgcolor="#f5f5f5">
        <GroupList myGroups={samplemessage} />
      </Grid>

      {/* Main Chat Window */}
      <Grid
        item
        sm={8}
        xs={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          padding: "1rem 3rem",
        }}>
        <IconBtn />
        {groupName && <>
        {<GroupName />}
       <Typography variant="body1" margin={"2rem"} alignSelf={"flex-start"} >
        Members</Typography>
        
        <Stack
        maxWidth={"45rem"}
        width={"100%"}
        spacing={"2rem"}
        boxSizing={"border-box"}
        padding={{
          sm: "1rem",
          md: "1rem 4rem",
          xs:"0"
        }}
        overflow={"auto"}
        height={"50vh"}
        >
          {
            samplemessage.map((group) => (
              group && group.chatId ? (
                <UserItem key={group.chatId} user={group.sender} isAdded={false} handler={()=>{}} />
              ) : null
            ))
          }
          {
            sampleUsers.map(i =>(
              <UserItem key={i._id} user
              ={i} isAdded={false} handler={()=>{}} styling={
                {
                  bgcolor:"white",
                  boxShadow:"0 0 5px 0 rgba(0,0,0,0.1)",
                  padding:"1rem",
                  borderRadius:"5px"
                }
              }/>
            ))
          }
        </Stack>
        {ButtonGroup}
        
         </>}
      </Grid>
      {
        isAddMember && (
          <Suspense fallback={<div>Loading...</div>}>
            <AddMemberDialog 
              
            />
          </Suspense>
        )
      }

      {
        confirmDeleteDialog && (
          <Suspense fallback={<div>Loading...</div>}>
            <ConfirmDeleteDialog
              open={confirmDeleteDialog}
              handleClose={closeConfirmDeleteDialog}
              deletHandler={ConfirmHandler}
            />
          </Suspense>
        )
      }

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuOpen}
        sx={{
          "& .MuiDrawer-paper": { width: "50%" },
          display: { xs: "block", sm: "none" },
        }}>
        <GroupList myGroups={samplemessage} />
      </Drawer>
    </Grid>
  );
};

const GroupList = ({ width = "100%", myGroups = [] }) => (
  <Stack width={width}>
   {myGroups?.length > 0 ? (
  myGroups.map((group) => (
    group && group.chatId ? (
      <GroupItem key={group.chatId} group={group} chatId={group.chatId} />
    ) : null
  ))
) : (
  <Typography variant="h6" sx={{ color: "gray" }}>
    No groups found
  </Typography>
)}
  </Stack>
);

const GroupItem = memo(({ group, chatId }) => {
  const { sender, avatar } = group;

  return (
    <Link
      to={`/group?group=${chatId}`}
      style={{ textDecoration: "none", color: "inherit" }}
      onClick={() => console.log("clicked")}
    >
      <Stack
        direction="row"
        alignItems="center"
        padding="1rem"
        sx={{
          borderBottom: "1px solid #f0f0f0",
          "&:hover": { backgroundColor: "#f5f5f5" },
        }}
      >
        <AvatarCard avatar={avatar ? [avatar] : []} />
        <Typography sx={{ marginLeft: "1rem" }}>{sender.name}</Typography>
      </Stack>
    </Link>
  );
});

GroupItem.propTypes = {
  group: PropTypes.shape({
    avatar: PropTypes.string,
    sender: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  chatId: PropTypes.string.isRequired, // ✅ Fixed
};

GroupItem.displayName = "GroupItem";

export default Group;
