// import axios from 'axios';
// import { dashboardFailure, dashboardRequest, dashboardSuccess } from '../slices/dashboardSlice';

// // Add this extra function wrapper (Thunk pattern)
// export const getDashboardReports = () => async (dispatch) => {
//     try {
//         dispatch(dashboardRequest());

//         const { data } = await axios.get('/api/v1/report',{
//               withCredentials: true
//         });

//         dispatch(dashboardSuccess(data));
//     } catch (error) {
//         // Added safety check to prevent crash if error.response is missing
//         const message = error.response?.data?.message || error.message;
//         dispatch(dashboardFailure(message));
//     }
// };


// import axios from 'axios';
// import { dashboardFailure, dashboardRequest, dashboardSuccess } from '../slices/dashboardSlice';

// export const getDashboardReports = () => async (dispatch) => {
//     try {
//         dispatch(dashboardRequest());

//         const { data } = await axios.get('/api/v1/report', {
//             withCredentials: true // Cookies/Session ke liye zaroori hai
//         });

//         dispatch(dashboardSuccess(data));
//     } catch (error) {
//         // Agar error aaye to backend ka message dikha do, nahi to generic error
//         const message = error.response?.data?.message || "Kuch galat ho gaya!";
//         dispatch(dashboardFailure(message));
//     }
// };



import axios from 'axios';
import { dashboardFailure, dashboardRequest, dashboardSuccess } from '../slices/dashboardSlice';

export const getDashboardReports = () => async (dispatch) => {
    try {
        dispatch(dashboardRequest());

        // baseURL iruntha direct-ah work aagum, illana full URL kudukanum
        const { data } = await axios.get('/api/v1/report', {
            withCredentials: true
        });

        dispatch(dashboardSuccess(data));
    } catch (error) {
        const message = error.response?.data?.message || error.message || "something went wrong !";
        dispatch(dashboardFailure(message));
    }
};