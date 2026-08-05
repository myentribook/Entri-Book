import axios from 'axios'
import { creditActionFailure, creditActionRequest, creditActionSuccess, creditFailure, creditRequest, creditSuccess } from '../slices/creditSlice'

export const getCreditBills = () => async (dispatch) => {
    try {
        dispatch(creditRequest())
        const { data } = await axios.get('/api/v1/credit', { withCredentials: true })
        dispatch(creditSuccess(data))
    } catch (error) {
        dispatch(creditFailure(error.response.data.message))
    }
}

export const updateCreditBills = (id, creditData) => async (dispatch) => {
    try {
        dispatch(creditActionRequest())
        // FIXED: The backend expects { paidAmount: ... } instead of { amount: ... }
        const { data } = await axios.put(`/api/v1/bill/credit/${id}`, creditData, { withCredentials: true })
        dispatch(creditActionSuccess(data))
        dispatch(getCreditBills())
    } catch (error) {
        dispatch(creditActionFailure(error.response.data.message))
    }
}