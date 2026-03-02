import '../../index.css';
import styles from './app.module.css';
import { AppRouter } from './app-router';
import { AppHeader } from '@components';
import { useDispatch } from '@services/store';
import { useEffect } from 'react';
import { requestIngredients, requestUser } from '@slices';
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestIngredients());
    dispatch(requestUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppRouter />
    </div>
  );
};

export default App;
