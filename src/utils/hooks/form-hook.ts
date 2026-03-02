import {
  useState,
  SyntheticEvent,
  ChangeEvent,
  useMemo,
  useEffect
} from 'react';
import { isObjectsEqual } from '@utils/helpers/is-object-equal';

type useFormProps<T> = {
  initialState: T;
  actions: {
    submitAction: (data: T) => void;
    cancelAction?: () => void;
    changeAction?: (data: Partial<T>) => void;
  };
};

export const useForm = <T>({ initialState, actions }: useFormProps<T>) => {
  const [formValue, setFormValue] = useState(initialState);
  const isFormChanged = useMemo(
    () => !isObjectsEqual(initialState, formValue),
    [initialState, formValue]
  );

  useEffect(() => {
    setFormValue(initialState);
  }, [initialState]);

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue(initialState);
    actions.cancelAction?.();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState: T) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
    actions.changeAction?.({ [e.target.name]: e.target.value } as Partial<T>);
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (isFormChanged) {
      actions.submitAction(formValue);
    }
  };

  return {
    handleCancel,
    handleInputChange,
    handleSubmit,
    formValue,
    isFormChanged
  };
};
