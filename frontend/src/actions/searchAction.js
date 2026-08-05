import axios from 'axios';
import {
    searchRequest,
    searchSuccess,
    searchFailure
} from '../slices/searchSlice';

export const searchProduct = (keyword = '') => async (dispatch) => {
    try {
        dispatch(searchRequest());

        // keyword இருந்தால் தேடுதல், இல்லையெனில் அனைத்துப் பொருட்கள்
        const url = keyword ? `/api/v1/getDashboard?keyword=${keyword}` : '/api/v1/getDashboard';
        
        const { data } = await axios.get(url, { withCredentials: true });

        dispatch(searchSuccess(data));
    } catch (error) {
        dispatch(
            searchFailure(
                error.response?.data?.message || error.message
            )
        );
    }
};