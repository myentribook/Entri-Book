import axios from 'axios';
import {
    productsRequest, productsSuccess, productsFailure,
    productActionRequest, productActionSuccess, productActionFailure
} from '../slices/productSlice';

export const getProducts = (keyword = '') => async (dispatch) => {
    try {
        dispatch(productsRequest());
        // keyword இருந்தால் தேடுதல், இல்லையெனில் அனைத்துப் பொருட்கள்
        const url = keyword ? `/api/v1/products?keyword=${keyword}` : '/api/v1/products';
        const { data } = await axios.get(url, { withCredentials: true });
        dispatch(productsSuccess(data));
    } catch (error) {
        dispatch(productsFailure(error.response?.data?.message));
    }
};

export const createProduct = (productData) => async (dispatch) => {
    try {
        dispatch(productActionRequest());
        const { data } = await axios.post('/api/v1/product/new', productData, { withCredentials: true });
        dispatch(productActionSuccess(data)); // Backend-இல் இருந்து மெசேஜ் வரும்
        dispatch(getProducts()); // உடனே புதுப்பிக்கும்
    } catch (error) {
        dispatch(productActionFailure(error.response?.data?.message));
    }
};

export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch(productActionRequest());
        const { data } = await axios.put(`/api/v1/product/${id}`, productData, { withCredentials: true });
        dispatch(productActionSuccess(data));
        dispatch(getProducts());
    } catch (error) {
        dispatch(productActionFailure(error.response?.data?.message));
    }
};

export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch(productActionRequest());
        const { data } = await axios.delete(`/api/v1/product/${id}`, { withCredentials: true });
        dispatch(productActionSuccess(data));
        dispatch(getProducts());
    } catch (error) {
        dispatch(productActionFailure(error.response?.data?.message));
    }
};