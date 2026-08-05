import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: 'dashboards',
    initialState: {
        loading: false,
        report: null,
        error: null
    },
    reducers: {
        dashboardRequest(state) {
            state.loading = true;
        },
        dashboardSuccess(state, action) {
            state.loading = false;
            state.report = action.payload.reports;
            state.error = null;
        },
        dashboardFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.report = null;
        },
        resetDashboard(state) {
            state.report = null;
            state.loading = false;
            state.error = null;
        }
    }
});

export const { dashboardRequest, dashboardSuccess, dashboardFailure, resetDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;