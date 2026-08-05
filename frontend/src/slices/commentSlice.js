import { createSlice } from '@reduxjs/toolkit';

const commentSlice = createSlice({
    name: 'comment',
    initialState: {
        loading: false,
        comments: [],
        error: null,
        isCreated: false,
        isDeleted: false // Added missing initial state property
    },
    reducers: {
        commentRequest(state, action) {
            state.loading = true;
        },
        commentSuccess(state, action) {
            state.loading = false;
            state.comments = action.payload.comments;
        },
        commentFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        newCommentRequest(state, action) {
            state.loading = true;
            state.isCreated = false;
        },
        newCommentSuccess(state, action) {
            state.loading = false;
            state.comments.unshift(action.payload.comment);
            state.isCreated = true;
        },
        newCommentFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        deleteCommentRequest(state, action) {
            state.loading = true;
            state.isDeleted = false;
        },
        deleteCommentSuccess(state, action) {
            state.loading = false;
            state.isDeleted = true;
            state.comments = state.comments.filter((comment) => comment._id !== action.payload);
        },
        deleteCommentFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearCommentError(state) {
            state.error = null;
        },
        clearCommentCreated(state) {
            state.isCreated = false;
        },
        clearCommentDeleted(state) {
            state.isDeleted = false;
        }
    }
});

// Fixed Export Syntax for Actions
export const {
    commentRequest,
    commentSuccess,
    commentFailure,
    newCommentRequest,
    newCommentSuccess,
    newCommentFailure,
    deleteCommentRequest,
    deleteCommentSuccess,
    deleteCommentFailure,
    clearCommentError,
    clearCommentCreated,
    clearCommentDeleted
} = commentSlice.actions;

export default commentSlice.reducer;