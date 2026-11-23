const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin" />
      <p className="text-sage-500 text-sm">Loading...</p>
    </div>
  </div>
);

export default PageLoader;
