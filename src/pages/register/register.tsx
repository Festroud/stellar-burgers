import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { registerUser } from '../../services/slices/user-slice';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { registerUserRequest, registerUserError } = useAppSelector(
    (state) => state.user
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Предотвращаем повторные отправки
    if (registerUserRequest) return;

    dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then((result) => {
        navigate('/');
      })
      .catch((error) => {
        // Ошибка обрабатывается в slice
      });
  };

  return (
    <RegisterUI
      errorText={registerUserError || ''}
      email={email}
      userName={name}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setName}
      handleSubmit={handleSubmit}
    />
  );
};
