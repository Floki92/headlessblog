import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wordpressService } from '../services/wordpressService';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        const featuredQuery = `
          query FeaturedPosts {
            posts(first: 3, where: {categoryName: "featured"}) {
              nodes {
                id
                title
                excerpt
                date
                slug
                featuredImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
                categories {
                  nodes {
                    name
                    slug
                  }
                }
                author {
                  node {
                    name
                  }
                }
              }
            }
          }
        `;

        const recentQuery = `
          query RecentPosts {
            posts(first: 6) {
              nodes {
                id
                title
                excerpt
                date
                slug
                featuredImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
                categories {
                  nodes {
                    name
                    slug
                  }
                }
              }
            }
          }
        `;

        const [featuredData, recentData] = await Promise.all([
          wordpressService.graphqlRequest(featuredQuery),
          wordpressService.graphqlRequest(recentQuery)
        ]);

        setFeaturedPosts(featuredData.posts?.nodes || []);
        setRecentPosts(recentData.posts?.nodes || []);
        
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Function to handle scroll to featured section
  const scrollToFeatured = () => {
    const featuredSection = document.getElementById('featured-posts');
    if (featuredSection) {
      featuredSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 🌟 Hero Section */}
      <section className="relative bg-linear-to-b from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-size-[60px_60px]"></div>
        
        {/* Floating Shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-cyan-500/20 rounded-full blur-lg"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-medium">Latest Articles Published Daily</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Discover Insights That 
                <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-400"> Matter</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                Join thousands of readers getting expert insights on technology, 
                business, and personal growth. Transform your thinking with our curated content.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/blog"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Start Reading
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-gray-300">Articles Published</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-gray-300">Monthly Readers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-gray-300">Expert Writers</div>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              {/* Floating Elements Around Image - HIGHER Z-INDEX */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-cyan-400/10 rounded-full blur-lg z-20"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-400/10 rounded-full blur-lg z-20"></div>
              
              {/* Featured Posts Badges - HIGHER Z-INDEX */}
              <div className="absolute -left-4 top-1/4 transform -translate-y-1/2 z-30">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Trending</div>
                      <div className="text-white/60 text-xs">This Week</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 transform translate-y-1/2 z-30">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Popular</div>
                      <div className="text-white/60 text-xs">Readers Choice</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Image Container - LOWER Z-INDEX */}
              <div className="relative z-10">
                <div className="bg-linear-to-b from-blue-500/20 to-purple-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                  <div className="bg-linear-to-b from-white/10 to-white/5 rounded-xl p-6 border border-white/10">
                    <div className="aspect-square rounded-lg bg-linear-to-b from-cyan-400/20 to-blue-600/20 flex items-center justify-center relative overflow-hidden">
                      {/* Abstract Design - BEHIND content */}
                      <div className="absolute inset-0 opacity-30 z-0">
                        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-cyan-400 rounded-full blur-lg"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-500 rounded-full blur-lg"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500 rounded-full blur-xl"></div>
                      </div>
                      
                      {/* Central Icon/Graphic - ABOVE background */}
                      <div className="relative z-10 text-center">
                        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div className="text-white font-semibold">Knowledge Hub</div>
                        <div className="text-white/60 text-sm">Curated Content</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WORKING Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button 
            onClick={scrollToFeatured}
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center cursor-pointer hover:border-cyan-400 transition-colors duration-300 group animate-bounce"
            aria-label="Scroll to featured posts"
          >
            <div className="w-1 h-3 bg-white rounded-full mt-2 group-hover:bg-cyan-400 transition-colors duration-300"></div>
          </button>
        </div>
      </section>

      {/* 📰 News Ticker Bar */}
      <div className="bg-purple-600 text-white py-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-blue-900 via-purple-900 to-indigo-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            {/* News Label */}
            <div className="flex items-center bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-bold mr-6 shrink-0">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              LATEST
            </div>
            
            {/* News Content */}
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                <span className="mx-4">🚀 New feature: Real-time updates now live!</span>
                <span className="mx-4">📢 Join our webinar this Friday at 2 PM</span>
                <span className="mx-4">🎉 We just reached 10,000 subscribers!</span>
                <span className="mx-4">🔥 New tutorial: Mastering React Hooks</span>
                <span className="mx-4">⭐ Featured post: The Future of Web Development</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📚 Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section id="featured-posts" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <article 
                  key={post.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
                    index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                  }`}
                >
                  <Link to={`/blog/${post.slug}`} className="block">
                    {post.featuredImage && (
                      <div className={`relative overflow-hidden ${
                        index === 0 ? 'h-80' : 'h-48'
                      }`}>
                        <img 
                          src={post.featuredImage.node.sourceUrl} 
                          alt={post.featuredImage.node.altText}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
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
                      
                      <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors ${
                        index === 0 ? 'text-2xl' : 'text-xl'
                      }`}>
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt?.replace(/<[^>]*>/g, '')}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <span>{post.author?.node.name || 'Admin'}</span>
                          <span>•</span>
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <span className="text-blue-600 font-medium group-hover:underline">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 📖 Recent Posts & Left Sidebar */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar />
            </div>

            {/* Main Content - Recent Posts */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
                <Link 
                  to="/blog" 
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
                >
                  View All
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recentPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} featured={index < 2} />
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-12">
                <Link
                  to="/blog"
                  className="inline-flex items-center px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                >
                  Load More Articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 CTA Section */}
      <section className="py-16 bg-linear-to-r from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Knowledge?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of curious minds and never stop learning. 
            Explore hundreds of articles written by industry experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/blog"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore All Articles
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              About Our Mission
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;