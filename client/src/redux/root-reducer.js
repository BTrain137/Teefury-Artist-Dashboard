import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./user/user.reducer";
import artistReducer from "./artist/artist.reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "artist"],
};

const rootReducer = combineReducers({
  user: userReducer,
  artist: artistReducer,
});

export default persistReducer(persistConfig, rootReducer);
