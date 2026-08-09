import { createSlice } from "@reduxjs/toolkit";

const purchaseSlice = createSlice({
    name: "purchases",
    initialState: {
        loading: false,
        purchase: [],
        error: null,
        message: null
    },

    reducers: {
        purchaseRequest(state) {
            state.loading = true;
        },
        purchaseSuccess(state, action) {
            state.loading = false;
            state.purchase = action.payload.purchase;
        },
        purchaseFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        purchaseActionRequest(state) {
            state.loading = true;
        },
        purchaseActionSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message || "Success";
        },
        purchaseActionFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearPurchaseState(state) {
            state.error = null;
            state.message = null;
        },
        resetPurchase(state) {
            state.purchase = [];
            state.loading = false;
            state.error = null;
            state.message = null;
        }
    }
});

export const { 
    purchaseRequest, purchaseSuccess, purchaseFailure, 
    purchaseActionFailure, purchaseActionSuccess, purchaseActionRequest, 
    clearPurchaseState, resetPurchase 
} = purchaseSlice.actions;

export default purchaseSlice.reducer;
