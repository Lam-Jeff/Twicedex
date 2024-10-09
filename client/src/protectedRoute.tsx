import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./authProvider";

type IProtectedRouteProps = {
    children: React.ReactNode
}
export const ProtectedRoute = ({ children }: IProtectedRouteProps) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    if (!user) navigate("/");
    return children
}