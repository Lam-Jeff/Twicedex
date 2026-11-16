import { Navigate } from "react-router-dom";

type IProtectedRouteProps = {
  /**
   * A React component.
   */
  children: React.ReactNode;
};
export const ProtectedRoute = ({ children }: IProtectedRouteProps) => {
  return <>{children}</>;
};

