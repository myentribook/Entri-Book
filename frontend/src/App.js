// import './App.css';
// import Home from './components/Home';
// import Header from './components/layouts/header';
// import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// import { HelmetProvider } from 'react-helmet-async';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Product from './components/layouts/product';
// import Login from './components/user/Login';
// import Register from './components/user/Register';
// import { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { loadUser } from './actions/userActions';
// import Profile from './components/user/profile';
// import ProtectedRoute from './components/route/protectedRoute';
// import UpdateProfile from './components/user/updateProfile';
// import UpdatePassword from './components/user/updatePassword'
// import ForgotPassword from './components/user/forgotPassword'
// import ResetPassword from './components/user/resetPassword';
// import Purchase from './components/layouts/purchase'
// import Billing from './components/layouts/billing';
// import Loader from './components/layouts/loader';
// import Credit from './components/layouts/credit'
// import LegalInformation from './components/layouts/privacy';
// import SearchProduct from './components/layouts/dashboard'
// import Subscription from './components/layouts/subscription'
// import Review from './components/layouts/review'
// import Admin from './components/admin/adminComponent'


// function App() {
//   const dispatch = useDispatch();
//   const [appLoading, setAppLoading] = useState(true);


//   useEffect(() => {
//     // 2 seconds timer mattum oru Promise-ah podrom
//     const timerPromise = new Promise(resolve => setTimeout(resolve, 2000));

//     // loadUser-um timer-um renduமே complete aagura varaikkum wait pannum
//     const initApp = async () => {
//       await Promise.all([
//         dispatch(loadUser()),
//         timerPromise
//       ]);
//       setAppLoading(false);
//     };

//     initApp();
//   }, [dispatch]);

//   if (appLoading) {
//     return <Loader />;


//   }

//   return (
//     <Router>
//       <div className="App">
//         <HelmetProvider>
//           <Header />
//           <ToastContainer theme='dark' />

//           <Routes>
//             <Route path='/' element={<Home />} />
//             <Route path='/product' element={<Product />} />
//             <Route path='/login' element={<Login />} />
//             <Route path='/register' element={<Register />} />
//             <Route path='/myprofile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
//             <Route path='/myprofile/update' element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
//             <Route path='/myprofile/update/password' element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
//             <Route path='/password/forgot' element={<ForgotPassword />} />
//             <Route path='/password/reset/:token' element={<ResetPassword />} />
//             <Route path='/purchase' element={<Purchase />} />
//             <Route path='/billing' element={<Billing />} />
//             <Route path='/credit' element={<Credit />} />
//             <Route path='/privacy' element={<LegalInformation />} />
//             <Route path='/search/product' element={<SearchProduct />} />
//             <Route path='/subscription' element={<Subscription />} />
//             <Route path='/review' element={<Review />} />
//             <Route path='/admin' element={<Admin />} />
//           </Routes>
//         </HelmetProvider>
//       </div>
//     </Router>
//   );
// }
// export default App;


import './App.css';
import Home from './components/Home';
import Header from './components/layouts/header';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Product from './components/layouts/product';
import Login from './components/user/Login';
import Register from './components/user/Register';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // useSelector-ah import panniyachu
import { loadUser } from './actions/userActions';
import Profile from './components/user/profile';
import ProtectedRoute from './components/route/protectedRoute';
import UpdateProfile from './components/user/updateProfile';
import UpdatePassword from './components/user/updatePassword';
import ForgotPassword from './components/user/forgotPassword';
import ResetPassword from './components/user/resetPassword';
import Purchase from './components/layouts/purchase';
import Billing from './components/layouts/billing';
import Loader from './components/layouts/loader';
import Credit from './components/layouts/credit';
import LegalInformation from './components/layouts/privacy';
import SearchProduct from './components/layouts/dashboard';
import Subscription from './components/layouts/subscription';
import Review from './components/layouts/review';
import Admin from './components/admin/adminComponent';
import io from 'socket.io-client'; // Socket.io import panniyachu

const SOCKET_URL = 'http://16.171.148.56:8000'; // Ungaloda backend port

// === Local Socket Connector Component ===
function SocketManager() {
  const { user } = useSelector((state) => state.authState || {});

  useEffect(() => {
    if (!user) return; // User login panniruntha mattum socket connect aaganum

    const socket = io(SOCKET_URL, {
      auth: {
        userId: user?._id || user?.id
      }
    });

    socket.on('connect', () => {
      console.log("User Socket Connected Successfully:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return null;
}

function App() {
  const dispatch = useDispatch();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const timerPromise = new Promise(resolve => setTimeout(resolve, 2000));

    const initApp = async () => {
      await Promise.all([
        dispatch(loadUser()),
        timerPromise
      ]);
      setAppLoading(false);
    };

    initApp();
  }, [dispatch]);

  if (appLoading) {
    return <Loader />;
  }

  return (
    <Router>
      <div className="App">
        <HelmetProvider>
          <Header />
          <ToastContainer theme='dark' />
          
          {/* Inga SocketManager-ah add panniyachu */}
          <SocketManager />

          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/product' element={<Product />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/myprofile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path='/myprofile/update' element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
            <Route path='/myprofile/update/password' element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
            <Route path='/password/forgot' element={<ForgotPassword />} />
            <Route path='/password/reset/:token' element={<ResetPassword />} />
            <Route path='/purchase' element={<Purchase />} />
            <Route path='/billing' element={<Billing />} />
            <Route path='/credit' element={<Credit />} />
            <Route path='/privacy' element={<LegalInformation />} />
            <Route path='/search/product' element={<SearchProduct />} />
            <Route path='/subscription' element={<Subscription />} />
            <Route path='/review' element={<Review />} />
            <Route path='/admin' element={<Admin />} />
          </Routes>
        </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;
