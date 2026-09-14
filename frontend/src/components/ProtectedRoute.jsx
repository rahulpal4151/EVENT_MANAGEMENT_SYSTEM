import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/authContextValue';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useContext(AuthContext);

    // 1. Agar user login nahi hai, toh seedha Login page par bhej do
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Agar user login hai, par uske paas correct role nahi hai (eg. Participant trying to access Organizer page)
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // Wapas Home page bhej do
    }

    // 3. Agar auth aur role dono theek hain, toh andar ka page render karo
    return <Outlet />;
};

export default ProtectedRoute;