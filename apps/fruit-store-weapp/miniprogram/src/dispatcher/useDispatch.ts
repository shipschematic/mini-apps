import { useCallback } from 'react';
import { dispatcher } from './AppDispatcher';
import { AppAction } from './ActionTypes';

export const useDispatch = () => {
  const dispatch = useCallback((action: AppAction) => {
    dispatcher.dispatch(action);
  }, []);

  return dispatch;
};
