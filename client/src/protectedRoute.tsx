import { useContext } from "react";
import { AuthContext } from "./authProvider";
import { Loading } from "./loading";

type IProtectedRouteProps = {
    /**
     * A React component.
     */
    children: React.ReactNode
}
export const ProtectedRoute = ({ children }: IProtectedRouteProps) => {
    const { loading } = useContext(AuthContext);

    if (loading) return <Loading isLoading={loading} borderColor='rgb(243, 244, 245)' />;
    else return children;
}