import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, MapPin, Award, Video, Clock } from 'lucide-react';
import { fetchInstructor, clearCurrent } from '../redux/slices/instructorSlice';
import { SkeletonList } from '../components/common/Skeleton';
import Button from '../components/common/Button';
import { formatPrice } from '../utils/formatters';

const InstructorDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, reviews, loading, error } = useSelector((state) => state.instructors);

  useEffect(() => {
    dispatch(fetchInstructor(id));
    return () => dispatch(clearCurrent());
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <SkeletonList count={1} />
      </div>
    );
  }

  if (error || !current) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="font-display text-2xl font-bold text-sage-900 dark:text-sage-100">
          Instructor not found
        </h1>
        <p className="text-sage-500 mt-2">
          This instructor may have been removed or the link is invalid.
        </p>
        <Link to="/instructors" className="inline-block mt-6">
          <Button>Browse Instructors</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row gap-6">
            <img
              src={current.avatar}
              alt={current.name}
              className="w-40 h-40 rounded-2xl object-cover shadow-lg"
            />
            <div>
              <h1 className="font-display text-4xl font-bold text-sage-900 dark:text-sage-100">
                {current.name}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sage-500">
                <MapPin size={16} /> {current.location}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Star className="fill-amber-400 text-amber-400" size={18} />
                <span className="font-semibold">{current.rating}</span>
                <span className="text-sage-500">({current.reviewCount} reviews)</span>
              </div>
              <p className="mt-4 text-sage-600 dark:text-sage-300 leading-relaxed">{current.bio}</p>
            </div>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-sage-800 rounded-2xl border border-sage-100 dark:border-sage-700">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Award size={18} /> Experience & Certifications
              </h3>
              <p className="text-sage-600 dark:text-sage-400">{current.experience}+ years experience</p>
              <ul className="mt-2 space-y-1">
                {(current.certifications || []).map((c) => (
                  <li key={c} className="text-sm text-sage-500">• {c}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-white dark:bg-sage-800 rounded-2xl border border-sage-100 dark:border-sage-700">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Video size={18} /> Live Sessions
              </h3>
              <p className="text-sage-600 dark:text-sage-400 capitalize">
                {current.meetingProvider?.replace('_', ' ') || 'Zoom'} integration
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-3">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {(current.specializations || []).map((s) => (
                <span key={s} className="px-4 py-2 bg-sage-100 dark:bg-sage-700 rounded-full text-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <h3 className="font-display text-2xl font-bold mb-6">Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-sage-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="p-5 bg-white dark:bg-sage-800 rounded-xl border border-sage-100 dark:border-sage-700">
                    <div className="flex items-center gap-2 mb-2">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sage-600 dark:text-sage-300">{r.comment}</p>
                    <p className="text-sm text-sage-500 mt-2">— {r.user?.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 bg-white dark:bg-sage-800 rounded-2xl shadow-lg border border-sage-100 dark:border-sage-700">
            <p className="text-3xl font-bold text-sage-800 dark:text-sage-100">
              {formatPrice(current.sessionPrice)}
            </p>
            <p className="text-sage-500 flex items-center gap-1 mt-1">
              <Clock size={14} /> {current.sessionDuration || 60} min session
            </p>
            <Link to={`/book/${current._id}`} className="block mt-6">
              <Button className="w-full">Book Session</Button>
            </Link>
            <Link to="/instructors" className="block text-center text-sm text-sage-500 mt-4 hover:underline">
              ← Back to explore
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetails;
