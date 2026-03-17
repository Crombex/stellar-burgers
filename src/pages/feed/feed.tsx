import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { getFeedError, getFeedOrders, getFeedIsPending } from '@selectors';
import { useSelector, useDispatch } from '@services/store';
import { requestFeed } from '@slices';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(getFeedOrders);
  const isLoading: boolean = useSelector(getFeedIsPending);
  const error = useSelector(getFeedError);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!orders.length) {
      dispatch(requestFeed());
    }
  }, [dispatch]);

  if (!orders.length && isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div className='text text_type_main-medium pt-4'>{error}</div>;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(requestFeed())} />
  );
};
