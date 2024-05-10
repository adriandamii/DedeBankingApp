import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from '../features/auth/authService';
import { RootState, AppDispatch } from '../app/store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, user, status } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, status]);

  return { isLoggedIn, user, status };
};
