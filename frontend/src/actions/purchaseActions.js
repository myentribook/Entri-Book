import axios from 'axios';
import { 
    purchaseRequest, purchaseSuccess, purchaseFailure, // Get exports
    purchaseActionRequest, purchaseActionSuccess, purchaseActionFailure // Create exports
} from '../slices/purchaseSlices'; 

export const getPurchase = () => async (dispatch) => {
    try {
        dispatch(purchaseRequest());
        const { data } = await axios.get('/api/v1/purchase');
        dispatch(purchaseSuccess(data));
    } catch (error) {
        dispatch(purchaseFailure(error.response.data.message));
    }
};

export const createPurchase = (purchaseData) => async (dispatch) => {
    try {
        dispatch(purchaseActionRequest());
        const { data } = await axios.post('/api/v1/create/purchase', purchaseData);
        dispatch(purchaseActionSuccess(data.purchase));
        
        // Refresh the list
        dispatch(getPurchase()); 
    } catch (error) {
        dispatch(purchaseActionFailure(error.response.data.message));
        alert(error.response.data.message);
    }
};