import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/user-slice';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loginUserRequest, loginUserError } = useAppSelector(
    (state) => state.user
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Предотвращаем повторные отправки
    if (loginUserRequest) return;

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((result) => {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      })
      .catch((error) => {
        // Ошибка обрабатывается в slice
      });
  };

  return (
    <LoginUI
      errorText={loginUserError || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
