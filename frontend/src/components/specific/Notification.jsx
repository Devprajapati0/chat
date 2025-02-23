import {
    Dialog,
    DialogTitle,
    List,
    Stack,
    Typography,
  } from "@mui/material";
  import NotificationItem from "../shared/NotificationItem"; // Import correctly
  
  const sample = [
    {
      Sender: {
        avatar: "",
        name: "Devilal",
      },
      _id: "1",
    },
    {
      Sender: {
        avatar: "",
        name: "ramlal",
      },
      _id: "2",
    },
  ];
  
  const Notification = () => {
    const Friendhandler = ({ _id, accept }) => {
      console.log(`Friend request ${accept ? "accepted" : "rejected"} for ID:`, _id);
    };
  
    return (
      <Dialog open>
        <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth="25rem">
          <DialogTitle>Notification</DialogTitle>
  
          {sample.length > 0 ? (
            sample.map(({ Sender, _id }) => (
              <NotificationItem sender={Sender} _id={_id} handler={Friendhandler} key={_id} />
            ))
          ) : (
            <Typography textAlign="center">0 notifications</Typography>
          )}
        </Stack>
      </Dialog>
    );
  };
  
  export default Notification;
  