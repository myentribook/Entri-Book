import axios from "axios";

import {
    shareBillFailure,
    shareBillRequest,
    shareBillSuccess
} from "../slices/shareBill";

const getErrorMessage = (error) => {
    if (error && typeof error === "object") {
        const responseMessage = error.response?.data?.message;
        if (typeof responseMessage === "string" && responseMessage.trim().length > 0) {
            return responseMessage.trim();
        }
        if (typeof error.message === "string" && error.message.trim().length > 0) {
            return error.message.trim();
        }
    }
    return "Failed to send WhatsApp message";
};

export const shareBill = (id, shareData) => async (dispatch) => {
    try {
        dispatch(shareBillRequest());

        if (!id) {
            throw new Error("Bill ID is required");
        }

        const encodedId = encodeURIComponent(String(id).trim());

        const { data } = await axios.post(
            `/api/v1/share-whatsapp/${encodedId}`,
            shareData,
            {
                withCredentials: true,
                timeout: 20000
            }
        );

        dispatch(shareBillSuccess(data));

        return data;

    } catch (error) {
        const errorMessage = getErrorMessage(error);

        dispatch(shareBillFailure(errorMessage));

        throw error;
    }
};