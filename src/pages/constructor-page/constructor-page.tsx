import { useSelector } from '@services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients, BurgerConstructor } from '@components';
import { Preloader } from '@ui';
import { FC } from 'react';
import {
  getIngredients,
  getIngredientsError,
  getIngredientsIsPending
} from '@selectors';

export const ConstructorPage: FC = () => {
  const ingredients = useSelector(getIngredients);
  const isLoading = useSelector(getIngredientsIsPending);
  const error = useSelector(getIngredientsError);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className={`${styles.error} text text_type_main-medium pt-4`}>
        {error}
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className={`${styles.title} text text_type_main-medium pt-4`}>
        Нет игредиентов
      </div>
    );
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
