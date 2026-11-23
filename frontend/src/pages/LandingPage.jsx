import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ChevronDown, Star } from 'lucide-react';
import { fetchFeatured } from '../redux/slices/instructorSlice';
import { setSearchFilters } from '../redux/slices/uiSlice';
import InstructorCard from '../components/instructors/InstructorCard';
import { SkeletonList } from '../components/common/Skeleton';
import { YOGA_CATEGORIES, TESTIMONIALS, FAQ_ITEMS, SUCCESS_STORIES } from '../utils/constants';
import Button from '../components/common/Button';

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featured, featuredLoading } = useSelector((state) => state.instructors);
  const [search, setSearch] = useState({ yogaType: '', location: '' });
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    dispatch(fetchFeatured());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchFilters(search));
    navigate(`/instructors?yogaType=${search.yogaType}&location=${search.location}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-100 via-sage-50 to-coral-400/10 dark:from-sage-900 dark:via-sage-900 dark:to-sage-800" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-sage-300/30 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-coral-400/20 rounded-full blur-3xl animate-float" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-sage-200/60 dark:bg-sage-700 text-sage-700 dark:text-sage-200 text-sm font-medium rounded-full mb-6">
              Find your flow
            </span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-sage-900 dark:text-sage-50 leading-tight">
              Book yoga sessions that{' '}
              <span className="text-sage-600 dark:text-sage-300">harmonize</span> with your life
            </h1>
            <p className="mt-6 text-lg text-sage-600 dark:text-sage-300 max-w-lg leading-relaxed">
              Discover certified instructors, check real-time availability, and book personalized sessions — online or in-studio.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-3 p-2 bg-white dark:bg-sage-800 rounded-2xl shadow-xl border border-sage-100 dark:border-sage-700">
              <div className="flex-1 flex items-center gap-2 px-4">
                <Search size={20} className="text-sage-400" />
                <select
                  value={search.yogaType}
                  onChange={(e) => setSearch({ ...search, yogaType: e.target.value })}
                  className="w-full bg-transparent outline-none text-sage-800 dark:text-sage-100"
                >
                  <option value="">Yoga type</option>
                  {YOGA_CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Location"
                value={search.location}
                onChange={(e) => setSearch({ ...search, location: e.target.value })}
                className="flex-1 px-4 py-3 bg-sage-50 dark:bg-sage-900 rounded-xl outline-none text-sage-800 dark:text-sage-100"
              />
              <Button type="submit" className="sm:px-8">Search</Button>
            </form>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl animate-float">
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600"
                alt="Yoga practice"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-sage-800 p-4 rounded-2xl shadow-lg border border-sage-100 dark:border-sage-700">
              <p className="text-2xl font-display font-bold text-sage-700 dark:text-sage-200">12K+</p>
              <p className="text-sm text-sage-500">Sessions booked</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white dark:bg-sage-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-center text-sage-900 dark:text-sage-100 mb-12">
            Popular Yoga Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {YOGA_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/instructors?yogaType=${cat.name}`}
                className="p-6 bg-sage-50 dark:bg-sage-800 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all border border-sage-100 dark:border-sage-700"
              >
                <span className="text-3xl">{cat.icon}</span>
                <h3 className="mt-3 font-semibold text-sage-800 dark:text-sage-200">{cat.name}</h3>
                <p className="text-xs text-sage-500 mt-1">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Instructors */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-sage-900 dark:text-sage-100">
                Featured Instructors
              </h2>
              <p className="text-sage-500 mt-2">Hand-picked experts for your wellness journey</p>
            </div>
            <Link to="/instructors" className="text-sage-600 font-medium hover:underline">View all →</Link>
          </div>
          {featuredLoading ? (
            <SkeletonList count={3} />
          ) : (!featured || featured.length === 0) ? (
            <p className="text-center text-sage-500 py-8">
              No instructors available yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featured || []).map((inst) => (
                <InstructorCard key={inst._id} instructor={inst} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gradient-to-r from-sage-600 to-sage-700 text-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          {SUCCESS_STORIES.map((story) => (
            <div key={story.title}>
              <p className="text-4xl font-display font-bold">{story.stat}</p>
              <p className="font-semibold mt-2">{story.title}</p>
              <p className="text-sage-200 text-sm mt-1">{story.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">What Our Community Says</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="p-6 bg-white dark:bg-sage-800 rounded-2xl shadow-sm border border-sage-100 dark:border-sage-700">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sage-600 dark:text-sage-300 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 mt-6">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-sage-800 dark:text-sage-200">{t.name}</p>
                    <p className="text-sm text-sage-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-sage-50 dark:bg-sage-900/50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-sage-800 rounded-xl border border-sage-100 dark:border-sage-700 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-5 text-left font-medium text-sage-800 dark:text-sage-200"
                >
                  {item.q}
                  <ChevronDown className={`transition ${openFaq === i ? 'rotate-180' : ''}`} size={20} />
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-5 text-sage-600 dark:text-sage-400">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="font-display text-4xl font-bold text-sage-900 dark:text-sage-100">
          Ready to find your instructor?
        </h2>
        <p className="text-sage-500 mt-4 mb-8">Join thousands practicing mindful wellness</p>
        <Link to="/signup">
          <Button variant="coral" className="text-lg px-10">Start Free Today</Button>
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
