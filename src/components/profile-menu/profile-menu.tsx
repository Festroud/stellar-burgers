import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useAppDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/user-slice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch(() => {
        // Ошибка обрабатывается в slice
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
