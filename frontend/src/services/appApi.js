import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// define a service using a base URL and expected endpoints

const appApi = createApi({
    reducerPath: 'appApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5001' }),
    endpoints: (builder) => ({
        // Create a new user
        signupUser: builder.mutation({
            query: (user) => ({
                url: '/users',
                method: 'POST',
                body: user,
            }),
        }),

        // Login user
        loginUser: builder.mutation({
            query: (user) => ({
                url: '/users/login',
                method: 'POST',
                body: user,
            }),
        }),

        // Logout user
        logoutUser: builder.mutation({
            query: (payload) => ({
                url: '/logout',
                method: 'DELETE',
                body: payload,
            }),
        }),

        // Get user by id
        getUserById: builder.mutation({
            query: (id) => ({
                url: `/users/getUserById/${id}`,
                method: 'GET',
            }),
        }),

        // Update username
        updateUsername: builder.mutation({
            query: ({ id, newName }) => ({
                url: `/users/updateUsername/${id}/${newName}`,
                method: 'PUT',
                body: { id, newName },
            }),
        }),

        // Update password
        updatePassword: builder.mutation({
            query: ({ id, newPassword }) => ({
                url: `/users/updatePassword/${id}/${newPassword}`,
                method: 'PUT',
            }),
        }),

        // Update bio
        updateBio: builder.mutation({
            query: ({ id, newBio }) => ({
                url: `/users/updateBio/${id}/${newBio}`,
                method: 'PUT',
            }),
        }),

        // Update picture
        updatePicture: builder.mutation({
            query: ({ id, newPicture }) => ({
                url: `/users/updatePicture/${id}/${encodeURIComponent(newPicture)}`,
                method: 'PUT',
                body: { id, newPicture },
            }),
        }),

        // Delete account
        deleteAccount: builder.mutation({
            query: (id) => ({
                url: `/users/deleteAccount/${id}`,
                method: 'DELETE',
            }),
        }),
    })
});

export const {
    useSignupUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useGetUserByIdMutation,
    useUpdateUsernameMutation,
    useUpdatePasswordMutation,
    useUpdateBioMutation,
    useUpdatePictureMutation,
    useDeleteAccountMutation } = appApi;

export default appApi;