import {
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  Button,  // ✅ Added missing import
} from "@mui/material";
import UserItem from "../shared/UserItem";
import { useState } from "react";


const sampleUsers = [
  { avatar: "", name: "dev", _id: "1" },
  { avatar: "", name: "rev", _id: "2" },
];

const NewGroup = () => {
  const selectMemberHandler = (id) => {
    
    setSelectedMembers((prev) => prev.includes(id)? prev.filter(i => i != id):[...prev,id])
  };
  const submitHandler = () => {

  }
  
  const closeHandler=()=>{
    
  }

  const [groupName,setGroupName] = useState("");
  const [members,setMembers] = useState(sampleUsers);
  const [selectedMembers,setSelectedMembers] = useState([]);

  return (
    <Dialog open>
      <Stack p={{ xs: "1rem", sm: "3rem" }} spacing={"2rem"} maxWidth="25rem">
        <DialogTitle variant="h4" >New Group</DialogTitle>

        <TextField  value={groupName} onChange={(e)=>setGroupName(e.target.value)} label="Group Name" fullWidth />
        <Typography variant ="body1">Members</Typography>

        <Stack spacing={1}>
          {members.map((user) => (
            <UserItem key={user._id} user={user } isAdded={selectedMembers.includes(user._id)}  handler={selectMemberHandler} />
          ))}
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
          <Button variant="text" color="error">
            Cancel
          </Button>
          <Button variant="contained" onClick={submitHandler} >Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
