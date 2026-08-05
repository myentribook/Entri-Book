import { createSlice } from '@reduxjs/toolkit'

const statusSlice = createSlice({
    name: "StatusState",
    initialState: {
        loading: false,
        users: [],
        userStatus: {},
        error: null
    },
    reducers: {
        getUserRequest(state) {
            return {
                ...state,
                loading: true,
                error: null
            }
        },
        getUserSuccess(state, action) {
            return {
                ...state,
                loading: false,
                users: action.payload,
                error: null
            }
        },
        getUserFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        updateUserLiveStatus(state, action) {
            const { userId, isOnline, lastSeen } = action.payload
            return {
                ...state,
                userStatus: {
                    ...state.userStatus,
                    [userId]: {
                        isOnline,
                        lastSeen: lastSeen || state.userStatus[userId]?.lastSeen
                    }
                }
            }
        },

        resetUserStatus(state) {
            return {
                loading: false,
                users: [],
                userStatus: {},
                error: null
            }
        }

    }
})


export const {getUserFailure , getUserRequest , getUserSuccess , updateUserLiveStatus , resetUserStatus} =statusSlice.actions

export default statusSlice.reducer