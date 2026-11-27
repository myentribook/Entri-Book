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
            state.Credit = Array.isArray(action.payload?.creditBills)
                ? action.payload.creditBills
                : Array.isArray(action.payload)
                    ? action.payload
                    : [];
            state.error = null;
        },
        creditFailure(state, action) {
            state.loading = false;
            state.error = action.payload ?? null;
        },
        creditActionRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        creditActionSuccess(state, action) {
            state.loading = false;
            state.message = action.payload?.message ?? null;
            state.error = null;
        },
        creditActionFailure(state, action) {
            state.loading = false;
            state.error = action.payload ?? null;
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