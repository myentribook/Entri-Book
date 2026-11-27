// actions/userActions.js
import axios from 'axios';
import { loginFailure, loginRequest, loginSuccess, clearError, registerRequest, registerSuccess, registerFailure, loadUserRequest, loadUserSuccess, loadUserFailure, logoutSuccess, logoutFailure, updateProfileRequest, updateProfileSuccess, updateProfileFailure, updatePasswordRequest, updatePasswordSuccess, updatePasswordFailure, forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFailure, resetPasswordRequest, resetPasswordSuccess, resetPasswordFailure } from '../slices/authSlice';
import { resetDashboard } from '../slices/dashboardSlice'; 
import { resetProducts } from '../slices/productSlice';

const getErrorMessage = (error, fallbackMessage) => {
    if (error && typeof error === 'object') {
        const responseMessage = error.response?.data?.message;
        if (typeof responseMessage === 'string' && responseMessage.trim().length > 0) {
            return responseMessage.trim();
        }
        if (fallbackMessage !== undefined && typeof error.message === 'string' && error.message.trim().length > 0) {
            return error.message.trim();
        }
    }
    return fallbackMessage;
};


export const login = (email, password) => async (dispatch) => {
    try {
       
        dispatch(loginRequest());

        const { data } = await axios.post('/api/v1/login', { email, password }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });

        dispatch(loginSuccess(data));
    } catch (error) {

        const message = getErrorMessage(error, "Login failed");
        dispatch(loginFailure(message));
    }
};



export const clearAuthError = () => (dispatch) => {
    dispatch(clearError());
};


export const register = (userData) => async (dispatch) => {
    try {
        dispatch(registerRequest());

        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        };

        const { data } = await axios.post('/api/v1/register', userData, config);

        dispatch(registerSuccess(data));
    } catch (error) {
        const message = getErrorMessage(error, "Registration failed");
        dispatch(registerFailure(message));
    }
};


export const loadUser = () => async (dispatch) => {
    try {
        dispatch(loadUserRequest());

        const { data } = await axios.get('/api/v1/myprofile', { withCredentials: true });

        dispatch(loadUserSuccess(data));
    } catch (error) {
        if (error.response?.status === 401) {
            dispatch(loadUserFailure(null));
            return;
        }
        dispatch(loadUserFailure(getErrorMessage(error, undefined)));
    }
};



export const logout = () => async (dispatch) => {
    try {
        await axios.get('/api/v1/logout', {
            withCredentials: true
        });


        dispatch(resetDashboard());
        dispatch(resetProducts());

        dispatch(logoutSuccess());
    } catch (error) {
        const message = getErrorMessage(error, "Logout failed");
        dispatch(logoutFailure(message));
    }
};


export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch(updateProfileRequest());

        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        };

        const { data } = await axios.put('/api/v1/update', userData, config);

        dispatch(updateProfileSuccess(data));
    } catch (error) {
        const message = getErrorMessage(error, "Update failed");
        dispatch(updateProfileFailure(message));
    }
};


export const updatePassword = (formData) => async (dispatch) => {
    try {
        dispatch(updatePasswordRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }

        await axios.put('/api/v1/password/change', formData, config);

        dispatch(updatePasswordSuccess());
    } catch (error) {
        const message = getErrorMessage(error, "Update failed");
        dispatch(updatePasswordFailure(message));
    }
};



export const forgotPassword = (formData) => async (dispatch) => {
    try {
        dispatch(forgotPasswordRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/v1/password/forgot', formData, config);

        dispatch(forgotPasswordSuccess(data));
    } catch (error) {
        const message = getErrorMessage(error, "Update failed");
        dispatch(forgotPasswordFailure(message));
    }
};


export const resetPassword = (formData, token) => async (dispatch) => {
    try {
        dispatch(resetPasswordRequest());

        if (!token) {
            throw new Error("Update failed");
        }

        const encodedToken = encodeURIComponent(String(token).trim());

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post(`/api/v1/password/reset/${encodedToken}`, formData, config);

        dispatch(resetPasswordSuccess(data));
    } catch (error) {
        const message = getErrorMessage(error, "Update failed");
        dispatch(resetPasswordFailure(message));
    }
};