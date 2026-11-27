import axios from 'axios';
import {
    productsRequest, productsSuccess, productsFailure,
    productActionRequest, productActionSuccess, productActionFailure
} from '../slices/productSlice';

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
    return undefined;
};

export const getProducts = (keyword = '') => async (dispatch) => {
    try {
        dispatch(productsRequest());
        // keyword இருந்தால் தேடுதல், இல்லையெனில் அனைத்துப் பொருட்கள்
        const normalizedKeyword = typeof keyword === 'string' ? keyword.trim() : '';
        const url = normalizedKeyword
            ? `/api/v1/products?keyword=${encodeURIComponent(normalizedKeyword)}`
            : '/api/v1/products';
        const { data } = await axios.get(url, { withCredentials: true });
        dispatch(productsSuccess(data));
    } catch (error) {
        dispatch(productsFailure(getErrorMessage(error)));
    }
};

export const createProduct = (productData) => async (dispatch) => {
    try {
        dispatch(productActionRequest());
        const { data } = await axios.post('/api/v1/product/new', productData, { withCredentials: true });
        dispatch(productActionSuccess(data)); // Backend-இல் இருந்து மெசேஜ் வரும்
        await dispatch(getProducts()); // உடனே புதுப்பிக்கும்
    } catch (error) {
        dispatch(productActionFailure(getErrorMessage(error)));
    }
};

export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch(productActionRequest());
        if (!id) {
            throw new Error('Product ID is required');
        }
        const encodedId = encodeURIComponent(String(id).trim());
        const { data } = await axios.put(`/api/v1/product/${encodedId}`, productData, { withCredentials: true });
        dispatch(productActionSuccess(data));
        await dispatch(getProducts());
    } catch (error) {
        dispatch(productActionFailure(getErrorMessage(error)));
    }
};

export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch(productActionRequest());
        if (!id) {
            throw new Error('Product ID is required');
        }
        const encodedId = encodeURIComponent(String(id).trim());
        const { data } = await axios.delete(`/api/v1/product/${encodedId}`, { withCredentials: true });
        dispatch(productActionSuccess(data));
        await dispatch(getProducts());
    } catch (error) {
        dispatch(productActionFailure(getErrorMessage(error)));
    }
};