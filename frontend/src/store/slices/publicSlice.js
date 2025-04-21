import { createSlice } from "@reduxjs/toolkit";

const publicKeysSlice = createSlice({
  name: "publicKeys",
  initialState: {}, // key: userId, value: imported publicKey
  reducers: {
    setPublicKey(state, action) {
      const { _id, publicKey } = action.payload;
      let userId = _id;
      state[userId] = publicKey;
    },
  },
});

export const { setPublicKey } = publicKeysSlice.actions;
export default publicKeysSlice.reducer;
