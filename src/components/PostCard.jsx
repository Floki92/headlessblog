import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post, featured = false }) => {
  const title = post.title?.rendered || post.title || 'Untitled';
  const excerpt = post.excerpt?.rendered || post.excerpt || '';
  const slug = post.slug;
  const featuredImage = post.featuredImage?.node?.sourceUrl || 
                       post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const date = post.date ? new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  // Clean excerpt and limit length
  const cleanExcerpt = excerpt
    .replace(/<[^>]*>/g, '')
    .substring(0, 120) + '...';

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
      <Link to={`/blog/${slug}`} className="grow flex flex-col">
        {/* FIXED: Consistent image container for all posts */}
        <div className="w-full aspect-video overflow-hidden">
          {featuredImage ? (
            <img 
              src={featuredImage} 
              alt={post.featuredImage?.node?.altText || ''}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-6 grow flex flex-col">
          <div className="flex items-center space-x-2 mb-3">
            {post.categories?.nodes?.slice(0, 2).map(category => (
              <Link
                key={category.slug}
                to={`/blog?category=${category.slug}`}
                className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <Link to={`/blog/${slug}`} className="block grow">
            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          <p className="text-gray-600 mb-4 line-clamp-2 grow">
            {cleanExcerpt}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
            <div className="flex items-center space-x-2">
              <span>{post.author?.node?.name || 'Admin'}</span>
              <span>•</span>
              <time>{date}</time>
            </div>
            <Link 
              to={`/blog/${slug}`}
              className="text-blue-600 font-medium hover:underline flex items-center"
            >
              Read More
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;