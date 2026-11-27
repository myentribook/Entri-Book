import axios from 'axios';
import { 
    getUserRequest, 
    getUserSuccess, 
    getUserFailure, 
    updateUserLiveStatus as updateLiveStatusSlice 
} from '../slices/statusSlice';

const getErrorMessage = (error) => {
    if (error && typeof error === 'object') {
        const responseMessage = error.response?.data?.message;
        if (typeof responseMessage === 'string' && responseMessage.trim().length > 0) {
            return responseMessage.trim();
        }
        if (typeof error.message === 'string' && error.message.trim().length > 0) {
            return error.message.trim();
        }
    }
    return `failed to fetch users`;
};

export const getUsers = () => async (dispatch) => {
    try {
        dispatch(getUserRequest());

        const { data } = await axios.get('/api/v1/admin/users', {
            withCredentials: true
        });

        const usersPayload = data && typeof data === 'object' && 'users' in data
            ? (data.users || data)
            : data;

        dispatch(getUserSuccess(usersPayload));
    } catch (error) {
        const message = getErrorMessage(error);
        dispatch(getUserFailure(message));
    }
};

export const UpdateUserLiveStatus = (statusData) => (dispatch) => {
    dispatch(updateLiveStatusSlice(statusData));
};