import { Modal } from '@components';
import { useParams } from 'react-router-dom';
import { FC, ReactNode } from 'react';

export const OrderModal: FC<{ children: ReactNode; onClose: () => void }> = ({
  children,
  onClose
}) => {
  const { number } = useParams();

  return (
    <Modal title={`#${number}`} onClose={onClose}>
      {children}
    </Modal>
  );
};
