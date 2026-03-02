import { Modal } from '@components';
import { FC, ReactNode } from 'react';

export const IngredientModal: FC<{
  children: ReactNode;
  onClose: () => void;
}> = ({ children, onClose }) => (
  <Modal title='Детали ингредиента' onClose={onClose}>
    {children}
  </Modal>
);
