import { useAppSelector, useAppDispatch } from '../../services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { fetchFeed } from '../../services/slices/orders-slice';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  if (loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
