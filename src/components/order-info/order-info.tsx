import { FC, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '@services/store';
import { OrderInfoUI, Preloader } from '@ui';
import {
  getFeedOrderByNumber,
  getUserOrderByNumber,
  getIngredients
} from '@selectors';
import { requestUserOrders, requestFeed } from '@slices';
import { TIngredient, TOrder } from '@utils-types';
import { getFeedIsPending } from '@selectors';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const location = useLocation();
  const isLoading = useSelector(getFeedIsPending);

  const isProfileOrder = location.pathname.startsWith('/profile/orders');
  const isModal = !!location.state?.background;

  const allIngredients: TIngredient[] = useSelector(getIngredients);

  const orderData: TOrder | undefined = useSelector(
    isProfileOrder
      ? getUserOrderByNumber(Number(number))
      : getFeedOrderByNumber(Number(number))
  );

  useEffect(() => {
    if (isModal) return;
    if (!orderData && !isLoading) {
      if (isProfileOrder) {
        dispatch(requestUserOrders());
      } else {
        dispatch(requestFeed());
      }
    }
  }, [orderData, isLoading, isProfileOrder, dispatch]);

  const ingredients = useMemo(() => {
    if (!orderData) return [];
    return orderData.ingredients
      .map((id) => allIngredients.find((ing) => ing._id === id))
      .filter(Boolean) as TIngredient[];
  }, [orderData, allIngredients]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        const ing = ingredients.find((i) => i._id === item);
        if (!ing) return acc;
        if (!acc[item]) {
          acc[item] = { ...ing, count: 1 };
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, i) => sum + i.price * i.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      total,
      date: new Date(orderData.createdAt)
    };
  }, [orderData, ingredients]);

  if (!orderInfo || !ingredients.length) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
