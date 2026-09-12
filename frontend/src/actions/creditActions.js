import axios from 'axios'
import { creditActionFailure, creditActionRequest, creditActionSuccess, creditFailure, creditRequest, creditSuccess } from '../slices/creditSlice'

export const getCreditBills = () => async (dispatch) => {
    try {
        dispatch(creditRequest())
        const { data } = await axios.get('/api/v1/credit', { withCredentials: true })
        dispatch(creditSuccess(data))
    } catch (error) {
        dispatch(creditFailure(error.response?.data?.message || "Failed to fetch credit bills"))
    }
}

export const updateCreditBills = (id, bill) => async (dispatch) => {
    try {
        dispatch(creditActionRequest())
        const { data } = await axios.put(`/api/v1/credit/${id}`, bill, { withCredentials: true })
        dispatch(creditActionSuccess(data))
        dispatch(getCreditBills()) // Refresh list
    } catch (error) {
        dispatch(creditActionFailure(error.response?.data?.message || "Failed to update payment"))
    }
}