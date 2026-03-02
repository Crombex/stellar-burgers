import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '@services/store';
import { getUserInfo, getIsUserPending } from '@selectors';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  element: JSX.Element;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  element,
  onlyUnAuth
}: TProtectedRouteProps) => {
  const isUserLoading = useSelector(getIsUserPending);
  const user = useSelector(getUserInfo);
  const location = useLocation();

  if (isUserLoading) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return element;
};
