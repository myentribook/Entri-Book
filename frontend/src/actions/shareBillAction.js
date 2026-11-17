// import axios from 'axios'

// import{ shareBillFailure, shareBillRequest, shareBillSuccess } from '../slices/shareBill'

// export const shareBill = (id, shareData) => async (dispatch) => {

//     try {

//         dispatch(shareBillRequest())

//         const {data} = await axios.post(`/api/v1/share-whatsapp/${id}`,shareData)

//         dispatch(shareBillSuccess(data))


//     } catch (error) {

//         dispatch(shareBillFailure(error.response?.data?.message || error.message))

//     }

// }


import axios from "axios";

import {
    shareBillFailure,
    shareBillRequest,
    shareBillSuccess
} from "../slices/shareBill";

export const shareBill = (id, shareData) => async (dispatch) => {
    try {
        dispatch(shareBillRequest());

        const { data } = await axios.post(
            `/api/v1/share-whatsapp/${id}`,
            shareData,
            {
                withCredentials: true,
                timeout: 20000
            }
        );

        dispatch(shareBillSuccess(data));

        return data;

    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to send WhatsApp message";

        dispatch(shareBillFailure(errorMessage));

        throw error;
    }
};
