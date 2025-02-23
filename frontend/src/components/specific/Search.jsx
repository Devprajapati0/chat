import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import UserItem from "../shared/UserItem";

const sampleUsers = [
  { avatar: "", name: "dev", _id: "1" },
  { avatar: "", name: "rev", _id: "2" },
];

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState(sampleUsers);
  const [isLoadingSendFriendRequest, setIsLoadingSendFriendRequest] = useState(false);

  const addFriendHandler = (id) => {
    console.log("Adding friend:", id);
  };

  return (
    <Dialog open>
      <Stack p="2rem" direction="column" width="25rem">
        <DialogTitle textAlign="center">Find people</DialogTitle>
        <TextField
          label="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <List>
          {users.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
