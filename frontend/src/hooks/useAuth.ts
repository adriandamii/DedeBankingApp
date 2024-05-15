import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { checkAuthStatus } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, user, status } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(checkAuthStatus());
    }

  }, [dispatch, isLoggedIn, status]);

  return { isLoggedIn, user, status };
};
