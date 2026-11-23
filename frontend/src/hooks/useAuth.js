import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    ...auth,
    logout: () => dispatch(logout()),
    isAdmin: auth.user?.role === 'admin',
    isInstructor: auth.user?.role === 'instructor',
  };
};
