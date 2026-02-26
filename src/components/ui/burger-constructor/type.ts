import { TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: any;
  orderRequest: boolean;
  price: number;
  orderModalData: Omit<TOrder, 'ingredients'> | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
