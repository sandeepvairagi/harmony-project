import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-full border border-sage-200 dark:border-sage-600 disabled:opacity-40 hover:bg-sage-100 dark:hover:bg-sage-800 transition"
      >
        <ChevronLeft size={20} />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1)
        .map((p, idx, arr) => (
          <span key={p} className="flex items-center">
            {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-2 text-sage-400">...</span>}
            <button
              onClick={() => onPageChange(p)}
              className={`w-10 h-10 rounded-full text-sm font-medium transition ${
                p === page
                  ? 'bg-sage-600 text-white'
                  : 'hover:bg-sage-100 dark:hover:bg-sage-800 text-sage-600 dark:text-sage-300'
              }`}
            >
              {p}
            </button>
          </span>
        ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className="p-2 rounded-full border border-sage-200 dark:border-sage-600 disabled:opacity-40 hover:bg-sage-100 dark:hover:bg-sage-800 transition"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
