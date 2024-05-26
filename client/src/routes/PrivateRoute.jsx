import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Button/shared/Loader";

const PrivateRoute = ({ children }) => {
    const { user, loading, } = useAuth();
    const location = useLocation();
    console.log(location);
    if (loading) return <Loader />
    if (user) return children
    alert('You need to be logged in to view this page.');
    return <Navigate to='/' state={{ from: location }} replace='true' />
}

export default PrivateRoute;