import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
    <p className="text-8xl font-display font-bold text-sage-200 dark:text-sage-700">404</p>
    <h1 className="font-display text-3xl font-bold text-sage-900 dark:text-sage-100 mt-4">
      Page not found
    </h1>
    <p className="text-sage-500 mt-2 max-w-md">
      The page you are looking for does not exist or has been moved.
    </p>
    <Link to="/" className="mt-8">
      <Button>Back to Home</Button>
    </Link>
  </div>
);

export default NotFound;
