import { FC } from 'react';
import { IngredientDetailsUI, Preloader } from '@ui';
import { useSelector } from '@services/store';
import { getIngredientById, getIngredientsIsPending } from '@selectors';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const isLoading = useSelector(getIngredientsIsPending);
  const ingredientData = useSelector(getIngredientById(id!));

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return (
      <div className='text text_type_main-medium pt-4'>
        Ингредиент не найден
      </div>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
