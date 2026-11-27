import { createSlice } from '@reduxjs/toolkit';

const commentSlice = createSlice({
    name: 'comment',
    initialState: {
        loading: false,
        comments: [],
        error: null,
        isCreated: false,
        isDeleted: false 
    },
    reducers: {
        commentRequest(state, action) {
            state.loading = true;
            state.error = null;
        },
        commentSuccess(state, action) {
            state.loading = false;
            state.comments = Array.isArray(action.payload?.comments)
                ? action.payload.comments
                : Array.isArray(action.payload)
                    ? action.payload
                    : [];
            state.error = null;
        },
        commentFailure(state, action) {
            state.loading = false;
            state.error = action.payload ?? null;
        },
        newCommentRequest(state, action) {
            state.loading = true;
            state.isCreated = false;
            state.error = null;
        },
        newCommentSuccess(state, action) {
            state.loading = false;
            if (!Array.isArray(state.comments)) {
                state.comments = [];
            }
            if (action.payload?.comment) {
                state.comments.unshift(action.payload.comment);
            }
            state.isCreated = true;
            state.error = null;
        },
        newCommentFailure(state, action) {
            state.loading = false;
            state.error = action.payload ?? null;
            state.isCreated = false;
        },
        deleteCommentRequest(state, action) {
            state.loading = true;
            state.isDeleted = false;
            state.error = null;
        },
        deleteCommentSuccess(state, action) {
            state.loading = false;
            state.isDeleted = true;
            if (Array.isArray(state.comments)) {
                state.comments = state.comments.filter((comment) => comment?._id !== action.payload);
            }
            state.error = null;
        },
        deleteCommentFailure(state, action) {
            state.loading = false;
            state.error = action.payload ?? null;
            state.isDeleted = false;
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