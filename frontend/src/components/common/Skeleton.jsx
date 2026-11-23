export const SkeletonCard = () => (
  <div className="bg-white dark:bg-sage-800 rounded-2xl p-6 animate-pulse">
    <div className="w-full h-48 bg-sage-200 dark:bg-sage-700 rounded-xl mb-4" />
    <div className="h-4 bg-sage-200 dark:bg-sage-700 rounded w-3/4 mb-2" />
    <div className="h-3 bg-sage-200 dark:bg-sage-700 rounded w-1/2" />
  </div>
);

export const SkeletonList = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
