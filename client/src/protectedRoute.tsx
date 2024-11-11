import { useContext } from "react";
import { AuthContext } from "./authProvider";
import { Navigate } from "react-router-dom";

type IProtectedRouteProps = {
    /**
     * A React component.
     */
    children: React.ReactNode
}
export const ProtectedRoute = ({ children }: IProtectedRouteProps) => {
    const { user } = useContext(AuthContext);

    if (!user) <Navigate to='/' />;
    else return children;
}