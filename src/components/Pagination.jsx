import { Link } from 'react-router-dom';
import { CONFIG } from '../config';

export const Pagination = ({ current, total, category = '' }) => {
  const totalPages = Math.ceil(total / CONFIG.POSTS_PER_PAGE);
  
  if (totalPages <= 1) return null;

  const getPageUrl = (page) => {
    const params = new URLSearchParams();
    if (category) {
      params.set('category', category);
    }
    if (page > 1) {
      params.set('p', page.toString());
    }
    return `/blog?${params.toString()}`;
  };

  return (
    <nav className="flex justify-center items-center space-x-2 mt-8">
      {current > 1 && (
        <Link
          to={getPageUrl(current - 1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Previous
        </Link>
      )}
      
      <span className="text-gray-600 px-4 py-2">
        Page {current} of {totalPages}
      </span>
      
      {current < totalPages && (
        <Link
          to={getPageUrl(current + 1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Next
        </Link>
      )}
    </nav>
  );
};