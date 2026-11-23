import { Link } from 'react-router-dom';
import { Star, MapPin, Heart } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

const InstructorCard = ({ instructor, onFavorite, isFavorite }) => (
  <article className="group bg-white dark:bg-sage-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-sage-100 dark:border-sage-700">
    <Link to={`/instructors/${instructor._id}`} className="block relative">
      <img
        src={instructor.avatar || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'}
        alt={instructor.name}
        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      {onFavorite && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onFavorite(instructor._id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-sage-900/90 rounded-full shadow hover:scale-110 transition"
        >
          <Heart
            size={18}
            className={isFavorite ? 'fill-coral-500 text-coral-500' : 'text-sage-600'}
          />
        </button>
      )}
      {instructor.isFeatured && (
        <span className="absolute top-3 left-3 px-3 py-1 bg-coral-500 text-white text-xs font-medium rounded-full">
          Featured
        </span>
      )}
    </Link>
    <div className="p-5">
      <Link to={`/instructors/${instructor._id}`}>
        <h3 className="font-display text-lg font-semibold text-sage-900 dark:text-sage-100 group-hover:text-sage-600 transition">
          {instructor.name}
        </h3>
      </Link>
      <div className="flex items-center gap-1 mt-1 text-sm text-sage-500">
        <MapPin size={14} />
        {instructor.location}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Star size={14} className="fill-amber-400 text-amber-400" />
        <span className="text-sm font-medium">{instructor.rating}</span>
        <span className="text-sm text-sage-400">({instructor.reviewCount} reviews)</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {(instructor.yogaTypes || []).slice(0, 2).map((type) => (
          <span
            key={type}
            className="px-2 py-0.5 text-xs bg-sage-100 dark:bg-sage-700 text-sage-600 dark:text-sage-300 rounded-full"
          >
            {type}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-100 dark:border-sage-700">
        <span className="font-semibold text-sage-800 dark:text-sage-200">
          {formatPrice(instructor.sessionPrice)}
          <span className="text-sm font-normal text-sage-500">/session</span>
        </span>
        <Link
          to={`/book/${instructor._id}`}
          className="text-sm font-medium text-sage-600 hover:text-sage-800 dark:text-sage-400 dark:hover:text-sage-200"
        >
          Book →
        </Link>
      </div>
    </div>
  </article>
);

export default InstructorCard;
