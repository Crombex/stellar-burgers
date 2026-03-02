import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '@services/store';
import { getIsUserOrdersPending, getUserOrders } from '@selectors';
import { Preloader } from '@ui';
import { useLocation } from 'react-router-dom';
import { requestUserOrders } from '@services/slices/user-slice';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(getUserOrders);
  const isLoading = useSelector(getIsUserOrdersPending);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (!orders.length) {
      dispatch(requestUserOrders());
    }
  }, [dispatch, orders.length]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
