import axios from 'axios';
import { 
    purchaseRequest, purchaseSuccess, purchaseFailure, 
    purchaseActionRequest, purchaseActionSuccess, purchaseActionFailure 
} from '../slices/purchaseSlices'; 

const getErrorMessage = (error, fallbackMessage) => {
    if (error && typeof error === 'object') {
        const responseMessage = error.response?.data?.message;
        if (typeof responseMessage === 'string' && responseMessage.trim().length > 0) {
            return responseMessage.trim();
        }
    }
    return fallbackMessage;
};

export const getPurchase = () => async (dispatch) => {
    try {
        dispatch(purchaseRequest());
        const { data } = await axios.get('/api/v1/purchase', { withCredentials: true });
        dispatch(purchaseSuccess(data));
    } catch (error) {
        dispatch(purchaseFailure(getErrorMessage(error, "Error fetching purchases")));
    }
};

export const createPurchase = (purchaseData) => async (dispatch) => {
    try {
        dispatch(purchaseActionRequest());
        const { data } = await axios.post('/api/v1/create/purchase', purchaseData, { withCredentials: true });
        dispatch(purchaseActionSuccess(data)); // முழு response data-வையும் அனுப்புங்கள்
        
        // Refresh both lists immediately
        await dispatch(getPurchase()); 
    } catch (error) {
        dispatch(purchaseActionFailure(getErrorMessage(error, "Error creating purchase")));
    }
};