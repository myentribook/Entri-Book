// actions/userActions.js
import axios from 'axios';
import { loginFailure, loginRequest, loginSuccess, clearError, registerRequest, registerSuccess, registerFailure, loadUserRequest, loadUserSuccess, loadUserFailure, logoutSuccess, logoutFailure, updateProfileRequest, updateProfileSuccess, updateProfileFailure, updatePasswordRequest, updatePasswordSuccess, updatePasswordFailure, forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFailure, resetPasswordRequest, resetPasswordSuccess, resetPasswordFailure } from '../slices/authSlice';
import { resetDashboard } from '../slices/dashboardSlice'; // உங்கள் கோப்பு பாதையை சரிபார்க்கவும்
import { resetProducts } from '../slices/productSlice';


// userActions.js
export const login = (email, password) => async (dispatch) => {
    try {
        // console.log("Dispatching login request..."); // Check if this prints
        dispatch(loginRequest());

        const { data } = await axios.post('/api/v1/login', { email, password }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });

        // console.log("Login Success, Data:", data); // Check if this prints
        dispatch(loginSuccess(data));
    } catch (error) {
        // console.error("Login Error Details:", error.response); // Check this in console!

        const message = error.response?.data?.message || "Login failed";
        dispatch(loginFailure(message));
    }
};


// actions/userActions.js

export const clearAuthError = () => (dispatch) => {
    dispatch(clearError());
};


export const register = (userData) => async (dispatch) => {
    try {
        dispatch(registerRequest());

        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        const { data } = await axios.post('/api/v1/register', userData, config);

        dispatch(registerSuccess(data));
    } catch (error) {
        // Safe error handling to prevent crash
        const message = error.response?.data?.message || error.message || "Registration failed";
        dispatch(registerFailure(message));
    }
};


export const loadUser = () => async (dispatch) => {
    try {
        dispatch(loadUserRequest());

        // 2userActions.js la
        // Full url kudukama ipdi change pannunga:
        const { data } = await axios.get('/api/v1/myprofile', { withCredentials: true });

        dispatch(loadUserSuccess(data));
    } catch (error) {
        if (error.response?.status === 401) {
            dispatch(loadUserFailure(null));
            return;
        }
        dispatch(loadUserFailure(error.response?.data?.message));
    }
};

// export const loadUser = () => async (dispatch) => {
//     try {
//         dispatch(loadUserRequest());
//         const { data } = await axios.get('/api/v1/myprofile', { withCredentials: true });
//         dispatch(loadUserSuccess(data));
//     } catch (error) {
//         // Ippo inga "if (error.response?.status === 401)" check pannurathu correct
//         // Aana, failure-kku "null" anupunga, appothan screen-la error msg varathu
//         dispatch(loadUserFailure(error.response?.data?.message));
//     }
// };

// export const logout = () => async (dispatch) => {
//     try {
//         await axios.get('/api/v1/logout', {
//             withCredentials: true
//         });

//         dispatch(logoutSuccess());
//     } catch (error) {

//         const message = error.response?.data?.message || error.message || "Load user failed";
//         dispatch(logoutFailure(message));
//     }
// };



export const logout = () => async (dispatch) => {
    try {
        await axios.get('/api/v1/logout', {
            withCredentials: true
        });

        // Logout ஆனதும் டேட்டாவை அழிக்கவும்
        dispatch(resetDashboard());
        dispatch(resetProducts());

        dispatch(logoutSuccess());
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Logout failed";
        dispatch(logoutFailure(message));
    }
};


export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch(updateProfileRequest());

        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        // This calls your /api/v1/update route
        // The backend identifies the user via the token (req.user.id)
        const { data } = await axios.put('/api/v1/update', userData, config);

        dispatch(updateProfileSuccess(data));
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Update failed";
        dispatch(updateProfileFailure(message));
    }
};


export const updatePassword = (formData) => async (dispatch) => {
    try {
        dispatch(updatePasswordRequest());

        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        await axios.put('/api/v1/password/change', formData, config);

        dispatch(updatePasswordSuccess());
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Update failed";
        dispatch(updatePasswordFailure(message));
    }
};



export const forgotPassword = (formData) => async (dispatch) => {
    try {
        dispatch(forgotPasswordRequest());

        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/v1/password/forgot', formData, config);

        dispatch(forgotPasswordSuccess(data));
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Update failed";
        dispatch(forgotPasswordFailure(message));
    }
};


export const resetPassword = (formData, token) => async (dispatch) => {
    try {
        dispatch(resetPasswordRequest());

        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        const { data } = await axios.post(`/api/v1/password/reset/${token}`, formData, config);

        dispatch(resetPasswordSuccess(data));
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Update failed";
        dispatch(resetPasswordFailure(message));
    }
};



// --- Add this at the bottom of your actions/userActions.js file ---

// export const getUsers = () => async (dispatch) => {
//     try {
//         // Ungaloda backend-la users list edukka irukkura API route-ah inga podunga 
//         // (e.g., '/api/v1/admin/users' or '/api/v1/users')
//         const { data } = await axios.get('/api/v1/admin/users', { withCredentials: true });
        
//         // Oru vela unga slice/reducer-la getUsersSuccess iruntha dispatch pannunga, 
//         // illati data-ah mattum handle pannalam. Ungaloda admin reducer-ku etha maathiri mathikonga.
//         // dispatch({ type: 'GET_USERS_SUCCESS', payload: data });
//     } catch (error) {
//         const message = error.response?.data?.message || error.message || "Failed to fetch users";
//         // dispatch({ type: 'GET_USERS_FAIL', payload: message });
//     }
// };