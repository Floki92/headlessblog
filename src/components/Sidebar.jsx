import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { wordpressService } from '../services/wordpressService';

const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        setLoading(true);

        // Fetch categories
      const categoriesQuery = `
        query Categories {
          categories(first: 10) {
            nodes {
              id
              name
              slug
              count
            }
          }
        }
      `;

      const recentQuery = `
        query RecentPosts {
          posts(first: 5) {
            nodes {
              id
              title
              date
              slug
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
            }
          }
        }
      `;

        const [categoriesData, recentData] = await Promise.all([
          wordpressService.graphqlRequest(categoriesQuery),
          wordpressService.graphqlRequest(recentQuery)
        ]);

        setCategories(categoriesData.categories?.nodes || []);
        setRecentPosts(recentData.posts?.nodes || []);
        
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your newsletter service
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Categories Loading */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Loading */}
        <div className="bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl p-6">
          <div className="h-6 bg-white/20 rounded w-32 mb-3 animate-pulse"></div>
          <div className="h-4 bg-white/20 rounded w-full mb-4 animate-pulse"></div>
          <div className="h-10 bg-white/20 rounded mb-3 animate-pulse"></div>
          <div className="h-10 bg-white/20 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Explore Topics Widget */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Explore Topics</h3>
        <div className="space-y-3">
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/blog?category=${category.slug}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 group"
            >
              <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                {category.name}
              </span>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                {category.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Stay Updated Widget */}
      <div className="bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
        <p className="text-blue-100 mb-4">
          Get the latest articles delivered to your inbox. No spam ever.
        </p>
        <form onSubmit={handleNewsletterSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:border-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Subscribe
          </button>
        </form>
        <p className="text-xs text-blue-200 mt-3">
          Join 10,000+ subscribers
        </p>
      </div>

      {/* Trending Now Widget */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Trending Now</h3>
        <div className="space-y-4">
          {recentPosts.map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="flex items-start space-x-3 group"
            >
              {post.featuredImage && (
                <img 
                  src={post.featuredImage.node.sourceUrl} 
                  alt={post.featuredImage.node.altText}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
              )}
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">
                  {post.title}
                </h4>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(post.date).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;