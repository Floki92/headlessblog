import React, { useState, useEffect } from 'react';
import { usePosts } from '../hooks/usePosts';
import { Pagination } from '../components/Pagination';
import { useLocation, useNavigate } from 'react-router-dom';
import { wordpressService } from '../services/wordpressService';

const Blog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get('p')) || 1;
  const categorySlug = searchParams.get('category') || '';
  
  const { items: posts, loading, error, total } = usePosts(page, categorySlug);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categorySlug);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const query = `
          query Categories {
            categories(first: 20) {
              nodes {
                id
                name
                slug
                count
              }
            }
          }
        `;
        const data = await wordpressService.graphqlRequest(query);
        setCategories(data.categories?.nodes || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryFilter = (categorySlug) => {
    setSelectedCategory(categorySlug);
    const newSearchParams = new URLSearchParams();
    if (categorySlug) {
      newSearchParams.set('category', categorySlug);
    }
    if (page > 1) {
      newSearchParams.set('p', '1');
    }
    navigate(`/blog?${newSearchParams.toString()}`);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    navigate('/blog');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blog Header */}
      <div className="bg-white py-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center ">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest news, tutorials, and insights from our team. 
              All content powered by WordPress headless CMS.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <button
              onClick={clearFilters}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Posts
            </button>
            {categories.map(category => (
              <button
                key={category.slug}
                onClick={() => handleCategoryFilter(category.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.slug
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Active Filter Display */}
          {selectedCategory && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                Showing posts in: {categories.find(c => c.slug === selectedCategory)?.name}
                <button
                  onClick={clearFilters}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blog Content - Full Width Without Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading posts...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h3 className="text-red-800 font-semibold mb-2">Error loading posts</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-gray-600 text-lg mb-2">No posts found.</h3>
              <p className="text-gray-500 mb-4">
                {selectedCategory 
                  ? `No posts found in "${categories.find(c => c.slug === selectedCategory)?.name}" category.`
                  : 'Check back later for new content.'
                }
              </p>
              {selectedCategory && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all posts
                </button>
              )}
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <>
              {/* Posts Grid - Full Width */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    {post.featuredImage?.node?.sourceUrl && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={post.featuredImage.node.sourceUrl} 
                          alt={post.featuredImage.node.altText || post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        {post.categories?.nodes.slice(0, 2).map(category => (
                          <span 
                            key={category.slug}
                            className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                        <a href={`/blog/${post.slug}`}>{post.title}</a>
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt?.replace(/<[^>]*>/g, '') || 'No excerpt available.'}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <span>{post.author?.node?.name || 'Admin'}</span>
                          <span>•</span>
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <a href={`/blog/${post.slug}`} className="text-blue-600 font-medium hover:underline">
                          Read More →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination current={page} total={total} category={selectedCategory} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;