import { ProfileUI } from '@ui-pages';
import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from '@services/store';
import { getUserInfo, getUserError, getIsUserPending } from '@selectors';
import { requestUser, updateUser } from '@slices';

import { Preloader } from '@ui';
import { useForm } from '@utils/hooks/form-hook';
import { TUserForm } from '@utils-types';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserInfo);
  const error = useSelector(getUserError);
  const isLoading = useSelector(getIsUserPending);

  const initialForm: TUserForm = useMemo(
    () => ({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    }),
    [user]
  );

  if (isLoading || !user) {
    return <Preloader />;
  }

  const {
    handleInputChange,
    handleCancel,
    handleSubmit,
    formValue,
    isFormChanged
  } = useForm({
    initialState: initialForm,
    actions: {
      submitAction: (data) =>
        dispatch(updateUser(data)).then(() => {
          dispatch(requestUser());
        })
    }
  });

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={error}
    />
  );
};
