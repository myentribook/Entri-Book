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
            state.loading = true
        },
        creditSuccess(state, action) {
            state.loading = false
            state.Credit = action.payload.creditBills
        },
        creditFailure(state, action) {
            state.loading = false
            state.error = action.payload
        },
        creditActionRequest(state, action) {
            state.loading = true
        },
        creditActionSuccess(state, action) {
            state.loading = false
            state.message = action.payload.message
        },
        creditActionFailure(state, action) {
            state.loading = false
            state.error = action.payload
        },
        clearCreditState(state, action) {
            state.error = null
            state.message = null
        },
        resetCredit(state, action) {
            state.Credit = []
            state.loading = false
            state.error = null
            state.message = null
        }
    }

})


export const { creditRequest, creditSuccess, creditFailure, creditActionRequest, creditActionSuccess, creditActionFailure, clearCreditState, resetCredit } = creditSlice.actions

export default creditSlice.reducer