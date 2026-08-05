import { createSlice } from '@reduxjs/toolkit'

const searchSlice = createSlice({

    name: 'searchProduct',
    initialState: {
        loading: false,
        products: [],
        error: null,
        message: null
    },
    reducers: {

        searchRequest(state, action) {
            state.loading = true
        },
        searchSuccess(state, action) {
            state.loading = false
            state.products = action.payload.products
        },
        searchFailure(state, action) {
            state.loading = false
            state.error = action.payload
        },
        searchActionRequest(state, action) {
            state.loading = true
        },
        searchActionSuccess(state, action) {
            state.loading = false
            state.message = action.payload.message
        },
        searchActionFailure(state, action) {
            state.loading = false
            state.error = action.payload
        },
        clearSearchState(state, action) {
            state.error = null
            state.message = null
        },
        resetSearch(state, action) {
            state.loading = false
            state.products = []
            state.error = null
            state.message = null
        }

    }

})



export const { searchRequest, searchSuccess, searchFailure, searchActionRequest, searchActionSuccess, searchActionFailure, clearSearchState, resetSearch } = searchSlice.actions

export default searchSlice.reducer