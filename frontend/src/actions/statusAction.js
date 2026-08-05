
import axios from 'axios';
import { 
    getUserRequest, 
    getUserSuccess, 
    getUserFailure, 
    updateUserLiveStatus as updateLiveStatusSlice 
} from '../slices/statusSlice';

export const getUsers = () => async (dispatch) => {
    try {
        dispatch(getUserRequest());

        const { data } = await axios.get('/api/v1/admin/users', {
            withCredentials: true
        });

        dispatch(getUserSuccess(data.users || data));
    } catch (error) {
        const message = error.response?.data?.message || error.message || `failed to fetch users`;
        dispatch(getUserFailure(message));
    }
};

export const UpdateUserLiveStatus = (statusData) => (dispatch) => {
    dispatch(updateLiveStatusSlice(statusData));
};