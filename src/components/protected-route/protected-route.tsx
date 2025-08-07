import React from 'react';
import { useAppSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: React.ReactElement;
  anonymous?: boolean;
};

export const ProtectedRoute = ({
  children,
  anonymous = false
}: ProtectedRouteProps) => {
  const { isAuthChecked, isAuthenticated } = useAppSelector(
    (state) => state.user
  );

  const location = useLocation();
  const from = location.state?.from || '/';

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (anonymous && isAuthenticated) {
    return <Navigate to={from} />;
  }

  if (!anonymous && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
