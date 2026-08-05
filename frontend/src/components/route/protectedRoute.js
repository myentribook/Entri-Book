

// import { Children } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import Loader from '../layouts/loader'


// export default function ProtectedRoute({ children }) {

//     const { isAuthenticated, loading } = useSelector(state => state.authState)

//     if (!isAuthenticated && !loading) {
//         return <Navigate to={'/login'} />
//     }

//     if (isAuthenticated) {
//         return children;
//     }

//     if (loading) {
//         return <Loader />
//     }

// }

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useSelector(state => state.authState);

    // 1. Always check loading first. 
    // If we are still checking the user's status, show the loader.
    if (loading) {
        return <Loader />;
    }

    // 2. If we are done loading and NOT authenticated, force redirect to login.
    if (!isAuthenticated) {
        return <Navigate to={'/login'} />;
    }

    // 3. If we are done loading AND authenticated, show the page.
    return children;
}