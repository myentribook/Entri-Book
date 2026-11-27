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
                user: action.payload?.user ?? null,
                error: null
            };
        },
        loginFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload ?? null // Now we can display this
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
                error: action.payload ?? null,
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
                user: action.payload?.user ?? null
            };
        },
        loadUserFailure(state, action) {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: action.payload ?? null
            };
        },
        logoutSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: null
            };
        },
        logoutFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload ?? null
            };
        },
        updateProfileRequest(state) {
            return { ...state, loading: true, isUpdated: false, error: null };
        },
        updateProfileSuccess(state, action) {
            return {
                ...state,
                loading: false,
                user: action.payload?.user ?? state.user ?? null,
                isUpdated: true,
                error: null
            };
        },
        updateProfileFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload ?? null
            };
        },
        clearUpdateProfile(state, action) {
            return {
                ...state,
                isUpdated: false
            };
        },
        updatePasswordRequest(state) {
            return { ...state, loading: true, isUpdated: false, error: null };
        },
        updatePasswordSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isUpdated: true,
                error: null
            };
        },
        updatePasswordFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload ?? null
            };
        },
        forgotPasswordRequest(state) {
            return { ...state, loading: true, message: null, error: null };
        },
        forgotPasswordSuccess(state, action) {
            return {
                ...state,
                loading: false,
                message: action.payload?.message ?? null,
                error: null
            };
        },
        forgotPasswordFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload ?? null
            };
        },
        resetPasswordRequest(state) {
            return { ...state, loading: true, error: null };
        },
        resetPasswordSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload?.user ?? null,
                error: null
            };
        },
        resetPasswordFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload ?? null
            };
        },
    }
});

export const { clearUpdateProfile, forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFailure, resetPasswordRequest, resetPasswordSuccess, resetPasswordFailure, updatePasswordRequest, updatePasswordSuccess, updatePasswordFailure, updateProfileRequest, updateProfileSuccess, updateProfileFailure, loginRequest, loginSuccess, loginFailure, clearError, registerRequest, registerSuccess, registerFailure, loadUserRequest, loadUserSuccess, loadUserFailure, logoutFailure, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;