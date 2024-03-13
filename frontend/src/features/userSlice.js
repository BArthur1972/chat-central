import { createSlice } from "@reduxjs/toolkit";
import appApi from "../services/appApi";

// userSlice is a reducer that will be used to store and update the user data in the Redux store.
export const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        addNotifications: (state, { payload }) => {
            if (state.newMessages[payload]) {
                state.newMessages[payload] = state.newMessages[payload] + 1;
            } else {
                state.newMessages[payload] = 1;
            }
        },
        resetNotifications: (state, { payload }) => {
            delete state.newMessages[payload];
        },
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

        // update user after updating username
        builder.addMatcher(
            appApi.endpoints.updateUsername.matchFulfilled,
            (state, action) => {
                return action.payload;
            }
        );

        // update user after updating password
        builder.addMatcher(
            appApi.endpoints.updatePassword.matchFulfilled,
            (state, action) => {
                return action.payload;
            }
        );

        // update user after updating bio
        builder.addMatcher(
            appApi.endpoints.updateBio.matchFulfilled,
            (state, action) => {
                return action.payload;
            }
        );

        // update user after updating picture
        builder.addMatcher(
            appApi.endpoints.updatePicture.matchFulfilled,
            (state, action) => {
                return action.payload;
            }
        );

        // update user after deleting account
        builder.addMatcher(
            appApi.endpoints.deleteAccount.matchFulfilled,
            () => {
                return null;
            }
        );
    }
});

export const { addNotifications, resetNotifications } = userSlice.actions;
export default userSlice.reducer;