const Input = ({ label, error, className = '', ...props }) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1.5">
        {label}
      </label>
    )}
    <input
      className={`w-full px-4 py-3 rounded-xl border border-sage-200 dark:border-sage-600 bg-white dark:bg-sage-800 text-sage-900 dark:text-sage-100 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-500 transition ${error ? 'border-red-400' : ''} ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default Input;
