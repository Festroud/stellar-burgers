import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { getOrders } from '../../services/slices/user-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.user.orders);

  useEffect(() => {
    dispatch(getOrders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
