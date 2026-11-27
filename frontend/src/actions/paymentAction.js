import axios from 'axios';
import { 
    createPaymentRequest, 
    createPaymentSuccess, 
    createPaymentFailure, 
    trailRequest, 
    trailSuccess, 
    trailFailure, 
    verifyPaymentRequest, 
    verifyPaymentSuccess, 
    verifyPaymentFailure,
    subscriptionRequest,
    subscriptionSuccess,
    subscriptionFail 
} from '../slices/paymentSlice';



const API = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
        ? '' // Relative path: Same domain / IP-ku request pogum
        : 'http://localhost:8000',
    withCredentials: true
});

const getErrorMessage = (error, fallbackMessage) => {
    if (error && typeof error === 'object') {
        const responseMessage = error.response?.data?.message;
        if (typeof responseMessage === 'string' && responseMessage.trim().length > 0) {
            return responseMessage.trim();
        }
        if (typeof error.message === 'string' && error.message.trim().length > 0) {
            return error.message.trim();
        }
    }
    return fallbackMessage;
};

export const createPayment = (paymentData) => async (dispatch) => {
    try {
        dispatch(createPaymentRequest());
        const { data } = await API.post(`/api/v1/order`, paymentData);
        dispatch(createPaymentSuccess(data));
    } catch (error) {
        const message = getErrorMessage(error, `payment failure`);
        dispatch(createPaymentFailure(message));
    }
};

export const trails = (trailData) => async (dispatch) => {
    try {
        dispatch(trailRequest());
        const { data } = await API.post(`/api/v1/trial`, trailData);
        dispatch(trailSuccess(data));
    } catch (error) {
        const message = getErrorMessage(error, 'Trails creation Failure');
        dispatch(trailFailure(message));
    }
};

export const verifyPayment = (verifyPaymentData) => async (dispatch) => {
    try {
        dispatch(verifyPaymentRequest());
        const { data } = await API.post(`/api/v1/verify`, verifyPaymentData);
        dispatch(verifyPaymentSuccess(data));
    } catch (error) {
        const message = getErrorMessage(error, `Verify Payment Failure`); 
        dispatch(verifyPaymentFailure(message));
    }
};

export const getMySubscription = () => async (dispatch) => {
    try {
        dispatch(subscriptionRequest());
        const { data } = await API.get(`/api/v1/my-subscription`);
        dispatch(subscriptionSuccess(data));
    } catch (error) {
        const message = getErrorMessage(error, 'Failed to fetch subscription');
        dispatch(subscriptionFail(message));
    }
};