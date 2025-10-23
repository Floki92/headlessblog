import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { wordpressService } from '../services/wordpressService';

const DynamicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchPage = async () => {
      try {
        setLoading(true);
        const pageData = await wordpressService.fetchPageBySlug(slug);
        if (mounted) {
          setPage(pageData);
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

    fetchPage();

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading page...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <h3 className="font-bold mb-2">Error loading page</h3>
          <p>{error}</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
  
  if (!page) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          ← Back to Home
        </Link>
      </div>
    </div>
  );

  const title = page.title?.rendered || page.title || 'Untitled';
  const content = page.content?.rendered || page.content || '';
  const featuredImage = page.featuredImage?.node?.sourceUrl || 
                       page._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <article className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          ← Back to Home
        </Link>
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" dangerouslySetInnerHTML={{ __html: title }} />
          {page.date && (
            <time className="text-gray-600 text-sm">
              Last updated: {new Date(page.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          )}
        </header>

        {featuredImage && (
          <img 
            src={featuredImage} 
            alt={page.featuredImage?.node?.altText || ''}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
          />
        )}

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      </div>
    </article>
  );
};

export default DynamicPage;