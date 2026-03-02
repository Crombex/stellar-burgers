import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '@services/store';
import { getUserInfo } from '@selectors';

export const AppHeader: FC = () => {
  const userName = useSelector(getUserInfo);
  return <AppHeaderUI userName={userName?.name ?? ''} />;
};
