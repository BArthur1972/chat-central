import { createSlice } from "@reduxjs/toolkit";
import appApi from "../services/appApi";

// Define the initial state using that type
export const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        addNotifications: (state, action) => {

        },

        resetNotifications: (state, action) => {

        }
        },
        
        extraReducers: (builder) => {
            // save user after signup
            builder.addMatcher(
                appApi.endpoints.signupUser.matchFulfilled,
                (state, action) => {
                    return action.payload;
                }
            );

            // save user after login
            builder.addMatcher(
                appApi.endpoints.loginUser.matchFulfilled,
                (state, action) => {
                    return action.payload;
                }
            );

            // destroy session after logout
            builder.addMatcher(
                appApi.endpoints.logoutUser.matchFulfilled,
                () => {
                    return null;
                }
            );
    }
    });

export const { addNotifications, resetNotifications } = userSlice.actions;
export default userSlice.reducer;