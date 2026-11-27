import axios from 'axios';
import {
    searchRequest,
    searchSuccess,
    searchFailure
} from '../slices/searchSlice';

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

export const searchProduct = (keyword = '') => async (dispatch) => {
    try {
        dispatch(searchRequest());

        const normalizedKeyword = typeof keyword === 'string' ? keyword.trim() : '';
        const url = normalizedKeyword
            ? `/api/v1/getDashboard?keyword=${encodeURIComponent(normalizedKeyword)}`
            : '/api/v1/getDashboard';
        
        const { data } = await axios.get(url, { withCredentials: true });

        dispatch(searchSuccess(data));
    } catch (error) {
        dispatch(
            searchFailure(
                getErrorMessage(error)
            )
        );
    }
};