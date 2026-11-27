import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'product',
    initialState: {
        loading: false,
        products: [],
        error: null,
        message: null
    },
    reducers: {
        productsRequest(state) {
            state.loading = true;
            state.error = null;
        },
        productsSuccess(state, action) {
            state.loading = false;
            state.products = action?.payload?.products ?? [];
        },
        productsFailure(state, action) {
            state.loading = false;
            state.error = action?.payload ?? null;
        },
        productActionRequest(state) {
            state.loading = true;
            state.error = null;
        },
        productActionSuccess(state, action) {
            state.loading = false;
            state.message = action?.payload?.message ?? null;
        },
        productActionFailure(state, action) {
            state.loading = false;
            state.error = action?.payload ?? null;
        },
        // Utility Logic
        clearProductState(state) {
            state.error = null;
            state.message = null;
        },
        resetProducts(state) {
            state.products = [];
            state.loading = false;
            state.error = null;
            state.message = null;
        }
    }
});

export const { 
    productsRequest, productsSuccess, productsFailure,
    productActionRequest, productActionSuccess, productActionFailure,
    clearProductState, resetProducts
} = productSlice.actions;

export default productSlice.reducer;