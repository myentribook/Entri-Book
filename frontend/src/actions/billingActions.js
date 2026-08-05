import axios from 'axios'
import { billActionFailure, billActionRequest, billActionSuccess, billFailure, billRequest, billSuccess } from '../slices/billSlice'



export const getBills = () => async (dispatch) => {

    try {

        dispatch(billRequest())
        const { data } = await axios.get('/api/v1/getBill', { withCredentials: true })
        dispatch(billSuccess(data))

    } catch (error) {
        dispatch(billFailure(error.response.data.message))
    }

}


export const createBill = (billData) => async (dispatch) => {

    try {

        dispatch(billActionRequest())
        const { data } = await axios.post('/api/v1/createBill', billData)
        dispatch(billActionSuccess(data.bill))

        dispatch(getBills())

    } catch (error) {

        dispatch(billActionFailure(error.response.data.message))

    }

}