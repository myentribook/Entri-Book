import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: true,
        isAuthenticated: false,
        error: null, // Added error field
        user: null
    },
    reducers: {
        loginRequest(state) {
            return { ...state, loading: true, error: null };
        },
        loginSuccess(state, action) {
            return {
                loading: false,
                isAuthenticated: true,
                user: action.payload.user,
                error: null
            };
        },
        loginFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload // Now we can display this
            };
        },
        clearError(state, action) {
            return {
                ...state,
                error: null
            };
        },
        // registerRequest(state) {
        //     return { ...state, loading: true, error: null };
        // },
        // registerSuccess(state, action) {
        //     return {
        //         loading: false,
        //         isAuthenticated: true,
        //         user: action.payload.user
        //     };
        // },
        // registerFailure(state, action) {
        //     return {
        //         ...state,
        //         loading: false,
        //         error: action.payload
        //     };
        // },

        registerRequest(state) {
            return { ...state, loading: true, error: null, isRegistered: false };
        },
        registerSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isRegistered: true,
                isAuthenticated: false,
                user: null
            };
        },
        registerFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
                isRegistered: false
            };
        },

        loadUserRequest(state) {
            return {
                ...state,
                isAuthenticated: false,
                loading: true,
                error: null
            };
        },
        loadUserSuccess(state, action) {
            return {
                loading: false,
                isAuthenticated: true,
                user: action.payload.user
            };
        },
        loadUserFailure(state, action) {
            return {
                ...state,
                loading: false
            };
        },
        logoutSuccess(state, action) {
            return {
                loading: false,
                isAuthenticated: false,
            };
        },
        logoutFailure(state, action) {
            return {
                ...state,
                error: action.payload
            };
        },
        updateProfileRequest(state) {
            return { ...state, loading: true, isUpdated: false };
        },
        updateProfileSuccess(state, action) {
            return {
                ...state,
                loading: false,
                user: action.payload.user,
                isUpdated: true
            };
        },
        updateProfileFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        },
        clearUpdateProfile(state, action) {
            return {
                ...state,
                isUpdated: false
            };
        },
        updatePasswordRequest(state) {
            return { ...state, loading: true, isUpdated: false };
        },
        updatePasswordSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isUpdated: true
            };
        },
        updatePasswordFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        },
        forgotPasswordRequest(state) {
            return { ...state, loading: true, message: null };
        },
        forgotPasswordSuccess(state, action) {
            return {
                ...state,
                loading: false,
                message: action.payload.message
            };
        },
        forgotPasswordFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        },
        resetPasswordRequest(state) {
            return { ...state, loading: true };
        },
        resetPasswordSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload.user,
                error: null
            };
        },
        resetPasswordFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        },
    }
});

export const { clearUpdateProfile, forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFailure, resetPasswordRequest, resetPasswordSuccess, resetPasswordFailure, updatePasswordRequest, updatePasswordSuccess, updatePasswordFailure, updateProfileRequest, updateProfileSuccess, updateProfileFailure, loginRequest, loginSuccess, loginFailure, clearError, registerRequest, registerSuccess, registerFailure, loadUserRequest, loadUserSuccess, loadUserFailure, logoutFailure, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;