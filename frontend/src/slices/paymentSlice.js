import { createSlice } from '@reduxjs/toolkit'

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        loading: false,
        payment: null,
        trail: null,
        subscription: null,
        isVerified: false,
        error: null,
        message: null
    },
    reducers: {
        // create Payment
        createPaymentRequest(state, action) {
            state.loading = true
            state.error = null
        },
        createPaymentSuccess(state, action) {
            state.loading = false
            state.payment = action?.payload?.order ?? null
            state.message = action?.payload?.message ?? null
        },
        createPaymentFailure(state, action) {
            state.loading = false
            state.error = action?.payload ?? null
        },

        // Trail Payment
        trailRequest(state, action) {
            state.loading = true
            state.error = null
        },
        trailSuccess(state, action) {
            state.loading = false
            state.trail = action?.payload?.trail ?? null
        },
        trailFailure(state, action) {
            state.loading = false
            state.error = action?.payload ?? null
        },

        // verify payment 
        verifyPaymentRequest(state, action) {
            state.loading = true
            state.error = null
        },
        verifyPaymentSuccess(state, action) {
            state.loading = false
            state.isVerified = true
            state.message = action?.payload?.message ?? null
        },
        verifyPaymentFailure(state, action) {
            state.loading = false
            state.isVerified = false
            state.error = action?.payload ?? null
        },

        // Get My Subscription
        subscriptionRequest(state, action) {
            state.loading = true
            state.error = null
        },
        subscriptionSuccess(state, action) {
            state.loading = false
            state.subscription = action?.payload?.subscription ?? null
        },
        subscriptionFail(state, action) {
            state.loading = false
            state.error = action?.payload ?? null
        },

        // Utility logic
        clearPaymentState(state, action) {
            state.error = null
            state.message = null
        },
        resetPayment(state) {
            state.loading = false
            state.payment = null
            state.trail = null
            state.subscription = null
            state.isVerified = false
            state.message = null
            state.error = null
        }
    }
})

export const { 
    createPaymentRequest, 
    createPaymentSuccess, 
    createPaymentFailure, 
    trailRequest, 
    trailSuccess, 
    trailFailure, 
    verifyPaymentRequest, 
    verifyPaymentSuccess, 
    verifyPaymentFailure, 
    subscriptionRequest,
    subscriptionSuccess,
    subscriptionFail,
    clearPaymentState, 
    resetPayment 
} = paymentSlice.actions

export default paymentSlice.reducer