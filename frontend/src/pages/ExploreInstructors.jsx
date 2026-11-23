import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { fetchInstructors } from '../redux/slices/instructorSlice';
import InstructorCard from '../components/instructors/InstructorCard';
import { SkeletonList } from '../components/common/Skeleton';
import Pagination from '../components/common/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import { YOGA_CATEGORIES } from '../utils/constants';

const ExploreInstructors = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { list, loading, pages, total } = useSelector((state) => state.instructors);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    keyword: '',
    yogaType: searchParams.get('yogaType') || '',
    location: searchParams.get('location') || '',
    minPrice: '',
    maxPrice: '',
    sort: '-rating',
  });
  const debouncedKeyword = useDebounce(filters.keyword);

  useEffect(() => {
    dispatch(
      fetchInstructors({
        page: currentPage,
        keyword: debouncedKeyword,
        yogaType: filters.yogaType,
        location: filters.location,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: filters.sort,
      })
    );
  }, [dispatch, debouncedKeyword, filters, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-sage-900 dark:text-sage-100">
          Explore Instructors
        </h1>
        <p className="text-sage-500 mt-2">{total} instructors available</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-72 space-y-4">
          <div className="p-6 bg-white dark:bg-sage-800 rounded-2xl border border-sage-100 dark:border-sage-700 sticky top-24">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <SlidersHorizontal size={18} /> Filters
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-sage-400" size={18} />
                <input
                  placeholder="Search..."
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sage-200 dark:border-sage-600 bg-sage-50 dark:bg-sage-900 outline-none"
                />
              </div>
              <select
                value={filters.yogaType}
                onChange={(e) => setFilters({ ...filters, yogaType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-sage-200 dark:border-sage-600 bg-sage-50 dark:bg-sage-900"
              >
                <option value="">All yoga types</option>
                {YOGA_CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
              <input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-sage-200 dark:border-sage-600 bg-sage-50 dark:bg-sage-900"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-sage-200 dark:border-sage-600 bg-sage-50 dark:bg-sage-900"
                />
                <input
                  type="number"
                  placeholder="Max $"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-sage-200 dark:border-sage-600 bg-sage-50 dark:bg-sage-900"
                />
              </div>
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-sage-200 dark:border-sage-600 bg-sage-50 dark:bg-sage-900"
              >
                <option value="-rating">Highest rated</option>
                <option value="sessionPrice">Price: Low to High</option>
                <option value="-sessionPrice">Price: High to Low</option>
              </select>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <SkeletonList />
          ) : (!list || list.length === 0) ? (
            <p className="text-center text-sage-500 py-20">No instructors found. Try adjusting filters.</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {(list || []).map((inst) => (
                  <InstructorCard key={inst._id} instructor={inst} />
                ))}
              </div>
              <Pagination page={currentPage} pages={pages} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreInstructors;
