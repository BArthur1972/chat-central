import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import appApi from "./services/appApi";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

// Define the persist config for the user slice
const userPersistConfig = {
    key: "user",
    storage,
};

// Create the root reducer
const rootReducer = {
    user: persistReducer(userPersistConfig, userReducer),
    [appApi.reducerPath]: appApi.reducer,
};

// Create the store object
const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk, appApi.middleware],
});

// Create the persisted store
const persistedStore = persistStore(store);

export { store, persistedStore };