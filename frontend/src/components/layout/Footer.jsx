import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-sage-800 dark:bg-sage-950 text-sage-200 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Link to="/" className="font-display text-2xl font-semibold text-white">
            Harmony Bookings
          </Link>
          <p className="mt-4 text-sage-300 max-w-md leading-relaxed">
            Discover world-class yoga instructors, book personalized sessions, and transform your wellness journey.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Explore</h4>
          <ul className="space-y-2 text-sage-300">
            <li><Link to="/instructors" className="hover:text-white transition">Instructors</Link></li>
            <li><Link to="/signup" className="hover:text-white transition">Sign Up</Link></li>
            <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Support</h4>
          <ul className="space-y-2 text-sage-300">
            <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
            <li><a href="mailto:support@harmony.com" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-sage-700 text-center text-sage-400 text-sm">
        © {new Date().getFullYear()} Harmony Bookings. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
