import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/slices/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    location: '',
    yogaPreferences: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      register({
        ...form,
        yogaPreferences: form.yogaPreferences
          ? form.yogaPreferences.split(',').map((s) => s.trim())
          : [],
      })
    );
    if (result.meta.requestStatus === 'fulfilled') navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-bold text-center text-sage-900 dark:text-sage-100">
          Join Harmony
        </h1>
        <p className="text-center text-sage-500 mt-2 mb-8">Start your wellness journey</p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-sage-800 p-8 rounded-2xl border border-sage-100 dark:border-sage-700">
          <Input label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <div>
            <label className="block text-sm font-medium mb-1.5">I am a</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-sage-200 dark:border-sage-600 bg-white dark:bg-sage-800"
            >
              <option value="user">Student / Practitioner</option>
              <option value="instructor">Yoga Instructor</option>
            </select>
          </div>
          <Input
            label="Yoga interests (comma separated)"
            value={form.yogaPreferences}
            onChange={(e) => setForm({ ...form, yogaPreferences: e.target.value })}
          />
          <Button type="submit" loading={loading} className="w-full">Create Account</Button>
        </form>

        <p className="text-center mt-6 text-sage-500">
          Already have an account?{' '}
          <Link to="/login" className="text-sage-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
