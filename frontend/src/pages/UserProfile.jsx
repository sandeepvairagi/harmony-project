import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../redux/slices/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import api from '../services/api';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    yogaPreferences: (user?.yogaPreferences || []).join(', '),
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/profile', {
        ...form,
        yogaPreferences: form.yogaPreferences.split(',').map((s) => s.trim()).filter(Boolean),
      });
      await dispatch(loadUser());
      toast.success('Profile updated');
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl font-bold text-sage-900 dark:text-sage-100">Profile</h1>
      <p className="text-sage-500 mt-1">Manage your account settings</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 bg-white dark:bg-sage-800 p-8 rounded-2xl border border-sage-100 dark:border-sage-700">
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" value={user?.email} disabled className="opacity-60" />
        <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <div>
          <label className="block text-sm font-medium mb-1.5">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-sage-200 dark:border-sage-600 bg-white dark:bg-sage-900"
          />
        </div>
        <Input
          label="Yoga preferences (comma separated)"
          value={form.yogaPreferences}
          onChange={(e) => setForm({ ...form, yogaPreferences: e.target.value })}
        />
        <Button type="submit" loading={loading}>Save Changes</Button>
      </form>
    </div>
  );
};

export default UserProfile;
