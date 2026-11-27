import axios from 'axios'
import { creditActionFailure, creditActionRequest, creditActionSuccess, creditFailure, creditRequest, creditSuccess } from '../slices/creditSlice'

const getErrorMessage = (error, fallbackMessage) => {
    if (error && typeof error === 'object') {
        const responseMessage = error.response?.data?.message
        if (typeof responseMessage === 'string' && responseMessage.trim().length > 0) {
            return responseMessage.trim()
        }
    }
    return fallbackMessage
}

export const getCreditBills = () => async (dispatch) => {
    try {
        dispatch(creditRequest())
        const { data } = await axios.get('/api/v1/credit', { withCredentials: true })
        dispatch(creditSuccess(data))
    } catch (error) {
        dispatch(creditFailure(getErrorMessage(error, "Failed to fetch credit bills")))
    }
}

export const updateCreditBills = (id, bill) => async (dispatch) => {
    try {
        dispatch(creditActionRequest())

        if (!id) {
            throw new Error("Failed to update payment")
        }

        const encodedId = encodeURIComponent(String(id).trim())
        const { data } = await axios.put(`/api/v1/credit/${encodedId}`, bill, { withCredentials: true })
        dispatch(creditActionSuccess(data))
        await dispatch(getCreditBills()) // Refresh list
    } catch (error) {
        dispatch(creditActionFailure(getErrorMessage(error, "Failed to update payment")))
    }
}