import axios from 'axios';
import { billActionFailure, billActionRequest, billActionSuccess, billFailure, billRequest, billSuccess } from '../slices/billSlice';

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
    return 'Something went wrong';
};

export const getBills = () => async (dispatch) => {
    try {
        dispatch(billRequest());
        const { data } = await axios.get('/api/v1/getBill', { withCredentials: true });
        dispatch(billSuccess(data));
    } catch (error) {
        dispatch(billFailure(getErrorMessage(error)));
    }
};



export const createBill = (billData) => async (dispatch) => {
    try {
        dispatch(billActionRequest());
        const { data } = await axios.post('/api/v1/createBill', billData, { withCredentials: true });
        dispatch(billActionSuccess(data));
        await dispatch(getBills());
    } catch (error) {
        dispatch(billActionFailure(getErrorMessage(error)));
    }
};