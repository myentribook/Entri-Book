import { createSlice } from '@reduxjs/toolkit'

const billSlice = createSlice({
    name: "Billing",
    initialState: {
        loading: false,
        bills: [],
        error: null,
        message: null
    },
    reducers: {
        billRequest(state) {
            state.loading = true
            state.error = null
        },
        billSuccess(state, action) {
            state.loading = false
            state.bills = Array.isArray(action.payload?.bills)
                ? action.payload.bills
                : Array.isArray(action.payload)
                    ? action.payload
                    : []
            state.error = null
        },
        billFailure(state, action) {
            state.loading = false
            state.error = action.payload ?? null
        },
        billActionRequest(state, action) {
            state.loading = true
            state.error = null
            state.message = null
        },
        billActionSuccess(state, action) {
            state.loading = false
            state.message = action.payload?.message ?? null
            state.error = null
        },
        billActionFailure(state, action) {
            state.loading = false
            state.error = action.payload ?? null
        },
        clearBillState(state, action) {
            state.error = null
            state.message = null
        },
        resetBill(state, action) {
            state.bills = []
            state.loading = false
            state.error = null
            state.message = null
        }
    }
})

export const { billRequest, billSuccess, billFailure, billActionRequest, billActionSuccess, billActionFailure, clearBillState, resetBill } = billSlice.actions
export default billSlice.reducer