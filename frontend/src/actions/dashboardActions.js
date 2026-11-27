import axios from 'axios';
import { dashboardFailure, dashboardRequest, dashboardSuccess } from '../slices/dashboardSlice';

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
    return "something went wrong !";
};

export const getDashboardReports = () => async (dispatch) => {
    try {
        dispatch(dashboardRequest());

        // baseURL iruntha direct-ah work aagum, illana full URL kudukanum
        const { data } = await axios.get('/api/v1/report', {
            withCredentials: true
        });

        dispatch(dashboardSuccess(data));
    } catch (error) {
        const message = getErrorMessage(error);
        dispatch(dashboardFailure(message));
    }
};