import axios from 'axios';
import { 
    purchaseRequest, purchaseSuccess, purchaseFailure, 
    purchaseActionRequest, purchaseActionSuccess, purchaseActionFailure 
} from '../slices/purchaseSlices'; 

export const getPurchase = () => async (dispatch) => {
    try {
        dispatch(purchaseRequest());
        const { data } = await axios.get('/api/v1/purchase');
        dispatch(purchaseSuccess(data));
    } catch (error) {
        dispatch(purchaseFailure(error.response?.data?.message || "Error fetching purchases"));
    }
};

export const createPurchase = (purchaseData) => async (dispatch) => {
    try {
        dispatch(purchaseActionRequest());
        const { data } = await axios.post('/api/v1/create/purchase', purchaseData);
        dispatch(purchaseActionSuccess(data)); // முழு response data-வையும் அனுப்புங்கள்
        
        // Refresh both lists immediately
        dispatch(getPurchase()); 
    } catch (error) {
        dispatch(purchaseActionFailure(error.response?.data?.message || "Error creating purchase"));
    }
};
