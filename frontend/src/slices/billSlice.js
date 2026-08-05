import { createSlice } from '@reduxjs/toolkit'

const billSlice = createSlice({
    name: "Billing",
    initialState: {
        loading: false,
        Billing: [],
        error: null,
        message: null
    },
    reducers: {
        billRequest(state) {
            state.loading = true
        },
        billSuccess(state, action) {
            state.loading = false
            state.Billing = action.payload.bills
        },
        billFailure(state, action) {
            state.loading = false
            state.error = action.payload
        },
        billActionRequest(state, action) {
            state.loading = true
        },
        billActionSuccess(state, action) {
            state.loading = false
            state.message = action.payload.message
        },
        billActionFailure(state, action) {
            state.loading = false
            state.error = action.payload
        },
        clearBillState(state, action) {
            state.error = null
            state.message = null
        },
        resetBill(state, action) {
            state.Billing = []
            state.loading = false
            state.error = null
            state.message = null
        }
    }
})

export const { billRequest, billSuccess, billFailure, billActionRequest, billActionSuccess, billActionFailure, clearBillState, resetBill } = billSlice.actions
export default billSlice.reducer