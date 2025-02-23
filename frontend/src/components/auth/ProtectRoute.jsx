import { Navigate, Outlet } from "react-router-dom"
import PropTypes from 'prop-types';


const ProtectRoute = ({children,user,redirect="./login"}) => {
    if(!user) return <Navigate to={redirect} />

    return children ? children : <Outlet />
}

ProtectRoute.propTypes = {
    children: PropTypes.node,
    user: PropTypes.object,
    redirect: PropTypes.string
};

export default ProtectRoute
