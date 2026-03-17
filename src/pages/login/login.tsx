import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '@services/store';
import { loginUser } from '@slices';
import { getUserError, getIsUserPending } from '@selectors';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(getUserError);
  const isLoading = useSelector(getIsUserPending);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (isLoading) {
    return <Preloader />;
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error ?? undefined}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
