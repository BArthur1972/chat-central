import { createSlice } from "@reduxjs/toolkit";
import appApi from "../services/appApi";

// userSlice is a reducer that will be used to store and update the user data in the Redux store.
export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        token: null
    },
    reducers: {
        addNotifications: (state, { payload }) => {
            if (state.user.newMessages[payload]) {
                state.user.newMessages[payload] = state.user.newMessages[payload] + 1;
            } else {
                state.user.newMessages[payload] = 1;
            }
        },
        resetNotifications: (state, { payload }) => {
            if (state.user) {
                delete state.user.newMessages[payload];
            }
        },
    },

    extraReducers: (builder) => {
        // save user after signup
        builder.addMatcher(
            appApi.endpoints.signupUser.matchFulfilled,
            (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
            }
        );

        // save user after login
        builder.addMatcher(
            appApi.endpoints.loginUser.matchFulfilled,
            (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
            }
        );

        // destroy session after logout
        builder.addMatcher(
            appApi.endpoints.logoutUser.matchFulfilled,
            (state) => {
                state.user = null;
                state.token = null;
            }
        );

        // update user after updating username
        builder.addMatcher(
            appApi.endpoints.updateUsername.matchFulfilled,
            (state, action) => {
                state.user = action.payload;
            }
        );

        // update user after updating password
        builder.addMatcher(
            appApi.endpoints.updatePassword.matchFulfilled,
            (state, action) => {
                state.user = action.payload;
            }
        );

        // update user after updating bio
        builder.addMatcher(
            appApi.endpoints.updateBio.matchFulfilled,
            (state, action) => {
                state.user = action.payload;
            }
        );

        // update user after updating picture
        builder.addMatcher(
            appApi.endpoints.updatePicture.matchFulfilled,
            (state, action) => {
                state.user = action.payload;
            }
        );

        // destroy user and token after deleting account
        builder.addMatcher(
            appApi.endpoints.deleteAccount.matchFulfilled,
            (state) => {
                state.user = null;
                state.token = null;
            }
        );
    }
});

export const { addNotifications, resetNotifications } = userSlice.actions;
export default userSlice.reducer;