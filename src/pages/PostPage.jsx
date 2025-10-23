import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { wordpressService } from '../services/wordpressService';
import Sidebar from '../components/Sidebar';

const PostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const postData = await wordpressService.fetchPostBySlug(slug);
        if (mounted) {
          setPost(postData);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-bold text-lg mb-2">Error loading post</h3>
            <p className="mb-4">{error}</p>
            <Link to="/blog" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (!post) return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The post you're looking for doesn't exist.</p>
          <Link to="/blog" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );

  const title = post.title?.rendered || post.title || 'Untitled';
  const content = post.content?.rendered || post.content || '';
  const featuredImage = post.featuredImage?.node?.sourceUrl || 
                       post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Back Button */}
              <div className="p-6 border-b border-gray-200">
                <Link 
                  to="/blog" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Blog
                </Link>
              </div>

              {/* Featured Image */}
              {featuredImage && (
                <div className="w-full h-64 md:h-96 overflow-hidden">
                  <img 
                    src={featuredImage} 
                    alt={post.featuredImage?.node?.altText || title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="p-6 md:p-8">
                {/* Categories */}
                {post.categories?.nodes && post.categories.nodes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories.nodes.map(category => (
                      <Link
                        key={category.slug}
                        to={`/blog?category=${category.slug}`}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                  dangerouslySetInnerHTML={{ __html: title }} 
                />

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-6 border-b border-gray-200">
                  {post.author?.node?.name && (
                    <div className="flex items-center">
                      <span className="font-medium">By {post.author.node.name}</span>
                    </div>
                  )}
                  {post.date && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <time>{new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</time>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: content }} 
                />

                {/* Tags (if available) */}
                {post.tags?.nodes && post.tags.nodes.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.nodes.map(tag => (
                        <span
                          key={tag.slug}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link 
                    to="/blog" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to All Posts
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;