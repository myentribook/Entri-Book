import axios from 'axios'
import { commentRequest, commentSuccess, commentFailure, newCommentRequest, newCommentSuccess, newCommentFailure, deleteCommentRequest, deleteCommentSuccess, deleteCommentFailure, clearCommentCreated, clearCommentDeleted, clearCommentError } from '../slices/commentSlice'

export const getComments = () => async (dispatch) => {

    try {

        dispatch(commentRequest())

        const { data } = await axios.get('/api/v1/comments')

        dispatch(commentSuccess(data))

    } catch (error) {

        dispatch(commentFailure(error.response?.data?.message || error.message))

    }

}


export const addComment = (commentData) => async (dispatch) => {

    try {

        dispatch(newCommentRequest())

        const config = { headers: { 'ContentType': 'application/json' } }

        const { data } = await axios.post(`/api/v1/comment/new`, commentData, config)

        dispatch(newCommentSuccess(data))

    } catch (error) {

        dispatch(newCommentFailure(error.response?.data?.message || error.message))

    }

}




export const deleteComment = (id) => async (dispatch) => {

    try {

        dispatch(deleteCommentRequest())

        await axios.delete(`/api/v1/comment/${id}`)

        dispatch(deleteCommentSuccess(id))

    } catch (error) {

        dispatch(deleteCommentFailure(error.response?.data?.message || error.message))

    }

}