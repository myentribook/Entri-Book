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
                users: action?.payload ?? [],
                error: null
            }
        },
        getUserFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action?.payload ?? null
            }
        },
        updateUserLiveStatus(state, action) {
            const { userId, isOnline, lastSeen } = action?.payload ?? {}
            if (!userId) {
                return state
            }
            const currentUserStatus = state?.userStatus ?? {}
            return {
                ...state,
                userStatus: {
                    ...currentUserStatus,
                    [userId]: {
                        isOnline: Boolean(isOnline),
                        lastSeen: lastSeen || currentUserStatus[userId]?.lastSeen || null
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