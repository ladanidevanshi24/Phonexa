import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "./utils/context";

const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useContext(Context);

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
