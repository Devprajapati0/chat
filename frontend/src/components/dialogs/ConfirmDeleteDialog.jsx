import { Button, Dialog, DialogActions, DialogContentText, DialogTitle } from "@mui/material"

const ConfirmDeleteDialog = ({open,handleClose,deletHandler}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Are you sure you want to delete this?</DialogTitle>
        <DialogContentText>This action cannot be undone</DialogContentText>
        <DialogActions>
            <Button color="error" onClick={handleClose}>Cancel</Button>
            <Button color="blue" onClick={deletHandler}>Delete</Button>
        </DialogActions>
    </Dialog>
  )
}

export default ConfirmDeleteDialog