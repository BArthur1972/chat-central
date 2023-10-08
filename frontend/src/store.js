import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import appApi from "./services/appApi";

// For persisting the Redux store
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import thunk from "redux-thunk";

// reducers
const reducer = combineReducers({
    user: userSlice,
    [appApi.reducerPath]: appApi.reducer,
});

// persist config
const persistConfig = {
    key: "root",
    storage,
    blacklist: [appApi.reducerPath],
};

// Persist the store
const persistedReducer = persistReducer(persistConfig, reducer);

// Create the store object
const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk, appApi.middleware],
});

export default store;