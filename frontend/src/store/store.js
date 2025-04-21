import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
// Import your slices here
import storage from "redux-persist/lib/storage";
import publicReducer from "./slices/publicSlice";

import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
const persistConfig = {
  key: "auth",
  storage,
};
const chatPersistConfig = {
  key: "chat",
  storage,
};
const persistChatReducer = persistReducer(chatPersistConfig, chatReducer);
const persistedPublicReducer = persistReducer(persistConfig, publicReducer);
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
import api from "./api/api";
 const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
   [ api.reducerPath]: api.reducer,
    chat: persistChatReducer,
    public: persistedPublicReducer,

  },
  middleware: (defaultmiddleware)=>[...defaultmiddleware(),api.middleware],
})
export const persistor = persistStore(store);
export default store;