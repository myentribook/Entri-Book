import { createSlice } from "@reduxjs/toolkit";

const shareBillSlice = createSlice({

    name: "shareBill",
    initialState: {
        loading: false,
        error: null,
        message: null
    },
    reducers: {
        shareBillRequest(state, action) {
            state.loading = true
            state.error = null
            state.message = null
        },
        shareBillSuccess(state, action) {
            state.loading = false
            state.message = action.payload.message || 'Bill Shared Successfully'
        },
        shareBillFailure(state, action) {
            state.loading = false
            state.error = action.payload
        },
        clearShareBillState(state) {
            state.error = null
            state.message = null
        },
        resetBill(state) {
            state.loading = false
            state.error = null
            state.message = null
        }
    }
})



export const { shareBillFailure, shareBillRequest, shareBillSuccess, clearShareBillState, resetBill } = shareBillSlice.actions

export default shareBillSlice.reducer