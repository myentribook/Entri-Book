// import { createPaymentRequest, createPaymentSuccess, createPaymentFailure, clearPaymentState, trailRequest, trailSuccess, trailFailure, resetPayment, verifyPaymentRequest, verifyPaymentSuccess, verifyPaymentFailure } from '../slices/paymentSlice'
// import axios from 'axios'



// export const createPayment = (paymentData) => async (dispatch) => {

//     try {

//         dispatch(createPaymentRequest())

//         const { data } = await axios.post(`/api/v1/order`, paymentData, {
//             withCredentials: true
//         })

//         dispatch(createPaymentSuccess(data))


//     } catch (error) {


//         const message = error.response?.data?.message || error.message || `payment failure`

//         dispatch(createPaymentFailure(message))


//     }

// }


// export const trails = (trailData) => async (dispatch) => {

//     try {

//         dispatch(trailRequest())

//         const { data } = await axios.post(`/api/v1/trial`, trailData, {
//             withCredentials: true
//         })

//         dispatch(trailSuccess(data))

//     } catch (error) {

//         const message = error.response?.data?.message || error.message || 'Trails creation Failure'

//         dispatch(trailFailure(message))

//     }

// }



// export const verifyPayment = (verifyPaymentData) => async (dispatch) => {

//     try {

//         dispatch(verifyPaymentRequest())

//         const { data } = await axios.post(`/api/v1/verify`, verifyPaymentData, {
//             withCredentials: true
//         })

//         dispatch(verifyPaymentSuccess(data))

//     } catch (error) {

//         const message = error.response?.data?.message || error.message || ` Verify Paymeny Failure` 
 
//         dispatch(verifyPaymentFailure(message))

//     }

// }
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

// const API = axios.create({
//     baseURL: 'http://16.171.148.56:8000/',
//     withCredentials: true
// });

const API = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
        ? 'http://16.171.148.56:8000'  // Domain name (HTTPS irukanum)
        : 'http://localhost:8000',
    withCredentials: true
});

export const createPayment = (paymentData) => async (dispatch) => {
    try {
        dispatch(createPaymentRequest());
        const { data } = await API.post(`/api/v1/order`, paymentData);
        dispatch(createPaymentSuccess(data));
    } catch (error) {
        const message = error.response?.data?.message || error.message || `payment failure`;
        dispatch(createPaymentFailure(message));
    }
};

export const trails = (trailData) => async (dispatch) => {
    try {
        dispatch(trailRequest());
        const { data } = await API.post(`/api/v1/trial`, trailData);
        dispatch(trailSuccess(data));
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Trails creation Failure';
        dispatch(trailFailure(message));
    }
};

export const verifyPayment = (verifyPaymentData) => async (dispatch) => {
    try {
        dispatch(verifyPaymentRequest());
        const { data } = await API.post(`/api/v1/verify`, verifyPaymentData);
        dispatch(verifyPaymentSuccess(data));
    } catch (error) {
        const message = error.response?.data?.message || error.message || `Verify Payment Failure`; 
        dispatch(verifyPaymentFailure(message));
    }
};

export const getMySubscription = () => async (dispatch) => {
    try {
        dispatch(subscriptionRequest());
        const { data } = await API.get(`/api/v1/my-subscription`);
        dispatch(subscriptionSuccess(data));
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch subscription';
        dispatch(subscriptionFail(message));
    }
};
