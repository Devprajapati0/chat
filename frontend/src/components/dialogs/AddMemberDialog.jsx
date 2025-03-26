import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import UserItem from '../shared/UserItem'
import { useState } from 'react';

const sampleUsers = [
    { avatar: "", name: "dev", _id: "1" },
    { avatar: "", name: "rev", _id: "2" },
  ];
const AddMemberDialog = ({addMember,isLoadingAddMemeber,chatId}) => {
    const [members,setMembers] = useState(sampleUsers);
    const [selectedMembers,setSelectedMembers] = useState([]);
  
    const addFriendHandler = (id) => {
        addMember(chatId,id)
        console.log(id)
    }
    const addMemberSubmitHandler = () => {
        closeHandler()
    }   
    const closeHandler = () => {
        console.log("close")
        selectMemberHandler([])
        setMembers([])
    }
    const selectMemberHandler = (id) => {
        
        setSelectedMembers((prev) => prev.includes(id)? prev.filter(i => i != id):[...prev,id])
      };

    
     
  return (
    <Dialog open onClose={closeHandler} >
        <Stack p={"2rem"} width={"20rem"} spacing={"2rem"} >
            <DialogTitle textAlign={"center"}>
                Add memeber
            </DialogTitle>
            <Stack spacing={"1rem"}>
                {
                  members.length > 0 ? ( members.map(i =>(
                        <UserItem key={i._id} user={i} handler={addFriendHandler} isAdded={
                            selectedMembers.includes(i._id)
                        } />
                    ))):<Typography textAlign={"center"} >No user found</Typography>   
                }
            </Stack>
            <Stack direction={"row"} justifyContent={"space-evenly"} alignItems={"center"} >
            <Button   color='error' onClick={addMemberSubmitHandler} disabled={isLoadingAddMemeber} >  Submit</Button>
            <Button onClick={closeHandler} variant='contained' >Cancel</Button>
            </Stack>
        </Stack>
    </Dialog>
  )
}

export default AddMemberDialog