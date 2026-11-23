import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (result.meta.requestStatus === 'fulfilled') {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-bold text-center text-sage-900 dark:text-sage-100">
          Welcome back
        </h1>
        <p className="text-center text-sage-500 mt-2 mb-8">Sign in to Harmony Bookings</p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-sage-800 p-8 rounded-2xl border border-sage-100 dark:border-sage-700 shadow-sm">
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>

        <p className="text-center mt-6 text-sage-500">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-sage-600 font-medium hover:underline">Sign up</Link>
        </p>
        <p className="text-center mt-4 text-xs text-sage-400">
          Demo: user@harmony.com / user123
        </p>
      </div>
    </div>
  );
};

export default Login;
