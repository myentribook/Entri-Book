import { createSlice } from "@reduxjs/toolkit";

const creditSlice = createSlice({
    name: "Credit",
    initialState: {
        loading: false,
        Credit: [],
        message: null,
        error: null
    },
    reducers: {
        creditRequest(state) {
            state.loading = true;
            state.error = null;
        },
        creditSuccess(state, action) {
            state.loading = false;
            state.Credit = action.payload.creditBills || [];
        },
        creditFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        creditActionRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        creditActionSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
        },
        creditActionFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearCreditState(state) {
            state.error = null;
            state.message = null;
        },
        resetCredit(state) {
            state.Credit = [];
            state.loading = false;
            state.error = null;
            state.message = null;
        }
    }
});

export const { 
    creditRequest, 
    creditSuccess, 
    creditFailure, 
    creditActionRequest, 
    creditActionSuccess, 
    creditActionFailure, 
    clearCreditState, 
    resetCredit 
} = creditSlice.actions;

export default creditSlice.reducer;