import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Button/shared/Loader";

const PrivateRoute = ({ children }) => {
    const { user, loading, } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location?.pathname || '/'
    if (loading) return <Loader />
    if (user) return children
    alert('You need to be logged in to view this page.');
    return navigate(from, { replace: true })
}

export default PrivateRoute;