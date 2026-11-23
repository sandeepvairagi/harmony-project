const variants = {
  primary: 'bg-sage-600 hover:bg-sage-700 text-white shadow-lg shadow-sage-600/20',
  secondary: 'bg-white dark:bg-sage-800 border border-sage-200 dark:border-sage-600 text-sage-700 dark:text-sage-200 hover:bg-sage-50 dark:hover:bg-sage-700',
  coral: 'bg-coral-500 hover:bg-coral-600 text-white',
  ghost: 'text-sage-600 dark:text-sage-300 hover:bg-sage-100 dark:hover:bg-sage-800',
};

const Button = ({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  disabled,
  ...props
}) => (
  <button
    className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading && (
      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    )}
    {children}
  </button>
);

export default Button;
