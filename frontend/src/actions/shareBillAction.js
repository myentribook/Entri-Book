import axios from 'axios'

import{ shareBillFailure, shareBillRequest, shareBillSuccess } from '../slices/shareBill'

export const shareBill = (id, shareData) => async (dispatch) => {

    try {

        dispatch(shareBillRequest())

        const {data} = await axios.post(`/api/v1/share-whatsapp/${id}`,shareData)

        dispatch(shareBillSuccess(data))


    } catch (error) {

        dispatch(shareBillFailure(error.response?.data?.message || error.message))

    }

}