// import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import dashboardsReducer from './slices/dashboardSlice';
// import productReducer from './slices/productSlice'
// import authReducer from './slices/authSlice'
// import purchaseReducer from './slices/purchaseSlices'
// import billReducer from './slices/billSlice'
// import creditReducer from './slices/creditSlice'
// import shareBillReducer from './slices/shareBill'
// import searchReducer from './slices/searchSlice'
// import paymentReducer from './slices/paymentSlice'
// import commentReducer from './slices/commentSlice'
// import userStatusReducer from './slices/userStatusSlice'


// const reducer = combineReducers({
//   dashboardState: dashboardsReducer,
//   productState: productReducer,
//   authState: authReducer,
//   purchaseState: purchaseReducer,
//   billingState: billReducer,
//   creditState: creditReducer,
//   shareBillState: shareBillReducer,
//   searchState: searchReducer,
//   paymentState: paymentReducer,
//   commentState: commentReducer,
//   userStatusState: userStatusReducer

// });

// const store = configureStore({
//   reducer,
//   // Middleware is handled automatically. 
//   // No need to manually add thunk here!
// });

// export default store;

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import dashboardsReducer from './slices/dashboardSlice';
import productReducer from './slices/productSlice';
import authReducer from './slices/authSlice';
import purchaseReducer from './slices/purchaseSlices';
import billReducer from './slices/billSlice';
import creditReducer from './slices/creditSlice';
import shareBillReducer from './slices/shareBill';
import searchReducer from './slices/searchSlice';
import paymentReducer from './slices/paymentSlice';
import commentReducer from './slices/commentSlice';
import userStatusReducer from './slices/statusSlice';

const reducer = combineReducers({
  dashboardState: dashboardsReducer,
  productState: productReducer,
  authState: authReducer,
  purchaseState: purchaseReducer,
  billingState: billReducer,
  creditState: creditReducer,
  shareBillState: shareBillReducer,
  searchState: searchReducer,
  paymentState: paymentReducer,
  commentState: commentReducer,
  StatusState: userStatusReducer,
});

const store = configureStore({
  reducer,
});

export default store;