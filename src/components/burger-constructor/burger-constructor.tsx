import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  getUserInfo,
  getBurgerConstructorBun,
  getBurgerConstructorIngredients,
  getBurgerConstructorOrderRequest,
  getOrderResponse
} from '@selectors';
import { clearOrderResponse, createOrder } from '@slices';
import { useSelector, useDispatch } from '@services/store';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(getUserInfo);
  const constructorItems = {
    bun: useSelector(getBurgerConstructorBun),
    ingredients: useSelector(getBurgerConstructorIngredients)
  };

  const orderRequest = useSelector(getBurgerConstructorOrderRequest);

  const orderModalData = useSelector(getOrderResponse);

  const onOrderClick = () => {
    if (!constructorItems.bun || constructorItems.ingredients.length === 0)
      return;
    if (!user) {
      navigate('/login');
      return;
    }
    const preparedIngredients = constructorItems.ingredients
      .map((ingredient) => ingredient._id)
      .concat(Array(2).fill(constructorItems.bun._id));
    dispatch(createOrder(preparedIngredients));
  };
  const closeOrderModal = () => {
    dispatch(clearOrderResponse());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
