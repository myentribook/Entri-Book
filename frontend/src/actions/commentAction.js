import axios from 'axios'
import { commentRequest, commentSuccess, commentFailure, newCommentRequest, newCommentSuccess, newCommentFailure, deleteCommentRequest, deleteCommentSuccess, deleteCommentFailure, clearCommentCreated, clearCommentDeleted, clearCommentError } from '../slices/commentSlice'

const getErrorMessage = (error) => {
    if (error && typeof error === 'object') {
        const responseMessage = error.response?.data?.message
        if (typeof responseMessage === 'string' && responseMessage.trim().length > 0) {
            return responseMessage.trim()
        }
        if (typeof error.message === 'string' && error.message.trim().length > 0) {
            return error.message.trim()
        }
    }
    return 'Something went wrong'
}

export const getComments = () => async (dispatch) => {

    try {

        dispatch(commentRequest())

        const { data } = await axios.get('/api/v1/comments', { withCredentials: true })

        dispatch(commentSuccess(data))

    } catch (error) {

        dispatch(commentFailure(getErrorMessage(error)))

    }

}


export const addComment = (commentData) => async (dispatch) => {

    try {

        dispatch(newCommentRequest())

        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }

        const { data } = await axios.post(`/api/v1/comment/new`, commentData, config)

        dispatch(newCommentSuccess(data))

    } catch (error) {

        dispatch(newCommentFailure(getErrorMessage(error)))

    }

}




export const deleteComment = (id) => async (dispatch) => {

    try {

        dispatch(deleteCommentRequest())

        if (!id) {
            throw new Error('Comment ID is required')
        }

        const encodedId = encodeURIComponent(String(id).trim())

        await axios.delete(`/api/v1/comment/${encodedId}`, { withCredentials: true })

        dispatch(deleteCommentSuccess(id))

    } catch (error) {

        dispatch(deleteCommentFailure(getErrorMessage(error)))

    }

}