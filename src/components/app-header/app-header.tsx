import { FC } from 'react';
import { useAppSelector } from '../../services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const { data: user } = useAppSelector((state) => state.user);

  return <AppHeaderUI userName={user?.name} />;
};
