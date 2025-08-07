import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { updateUser } from '../../services/slices/user-slice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const dispatch = useAppDispatch();
  const {
    data: user,
    updateUserRequest,
    updateUserError
  } = useAppSelector((state) => state.user);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Состояние для отслеживания фокуса на полях
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    !!formValue.password;

  // Показываем прелоадер пока пользователь не загружен
  if (!user) {
    return <Preloader />;
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const updateData: { name?: string; email?: string; password?: string } = {};

    if (formValue.name !== user?.name) updateData.name = formValue.name;
    if (formValue.email !== user?.email) updateData.email = formValue.email;
    if (formValue.password) updateData.password = formValue.password;

    if (Object.keys(updateData).length > 0) {
      dispatch(updateUser(updateData));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
    setFocusedField(null); // Сбрасываем фокус при отмене
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleInputFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleInputBlur = () => {
    setFocusedField(null);
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      focusedField={focusedField}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      handleInputFocus={handleInputFocus}
      handleInputBlur={handleInputBlur}
      updateUserError={updateUserError}
    />
  );
};
