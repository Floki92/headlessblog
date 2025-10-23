import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { wordpressService } from '../services/wordpressService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pages, setPages] = useState([]);
  const [siteInfo, setSiteInfo] = useState({
    title: 'Loading...',
    description: ''
  });
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Fetch site info and pages from WordPress
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch site information
        const siteInfoQuery = `
          query SiteInfo {
            generalSettings {
              title
              description
            }
          }
        `;

        const [siteData, pagesData] = await Promise.all([
          wordpressService.graphqlRequest(siteInfoQuery),
          wordpressService.fetchPages()
        ]);

        setSiteInfo({
          title: siteData.generalSettings?.title || 'My Blog',
          description: siteData.generalSettings?.description || ''
        });

        setPages(pagesData.items || []);
        
      } catch (error) {
        console.error('Error fetching header data:', error);
        // Fallback values
        setSiteInfo({
          title: 'My Blog',
          description: 'Professional Blog'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Static navigation items
  const staticNavItems = [
    { path: '/', label: 'Home' },
    { path: '/blog', label: 'Blog' },
  ];

  // Convert WordPress pages to navigation items
  const wordpressNavItems = pages
    .filter(page => {
      // Exclude pages that might conflict with static routes
      const excludedSlugs = ['home', 'blog'];
      return !excludedSlugs.includes(page.slug);
    })
    .map(page => ({
      path: `/${page.slug}`,
      label: page.title?.rendered || page.title || 'Untitled'
    }));

  // Combine static and WordPress pages
  const navItems = [...staticNavItems, ...wordpressNavItems];

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-linear-to-b from-blue-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-md shadow-lg border-b border-white/10' 
        : 'bg-linear-to-b from-blue-900 via-purple-900 to-indigo-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo with Dynamic WordPress Site Name */}
          <Link to="/" className="shrink-0 flex items-center space-x-3 group">
            <div className="relative">
              {/* Logo Background Effect */}
              <div className="absolute inset-0 bg-white/10 rounded-xl blur group-hover:bg-white/20 transition-colors"></div>
              {/* Logo Content */}
              <div className="relative bg-linear-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 group-hover:border-white/30 transition-all">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            
            {/* Dynamic WordPress Site Name */}
            <div className="text-white">
              {loading ? (
                // Loading skeleton for site name
                <div className="space-y-1">
                  <div className="w-32 h-6 bg-white/20 rounded animate-pulse"></div>
                  <div className="w-24 h-3 bg-white/10 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="text-xl font-bold leading-tight">
                    {siteInfo.title}
                  </div>
                  <div className="text-xs text-white/60 -mt-1 leading-none">
                    {siteInfo.description || 'Professional Blog'}
                  </div>
                </>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {loading ? (
              // Loading skeleton for navigation
              <div className="flex space-x-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-16 h-8 bg-white/10 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                    isActive(item.path)
                      ? 'text-white bg-white/10 backdrop-blur-sm shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {/* Hover underline effect */}
                  {!isActive(item.path) && (
                    <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-linear-to-b from-cyan-400 to-blue-400 transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10"></span>
                  )}
                </Link>
              ))
            )}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/contact"
              className="px-6 py-2.5 bg-linear-to-b from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get In Touch
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 bg-linear-to-b from-blue-900/95 to-purple-900/95 backdrop-blur-md">
            <div className="flex flex-col space-y-2">
              {loading ? (
                // Mobile loading skeleton
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-full h-12 bg-white/10 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <>
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                        isActive(item.path)
                          ? 'text-white bg-white/10 backdrop-blur-sm'
                          : 'text-white/80 hover:text-white hover:bg-white/5'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {/* Mobile CTA Button */}
                  <Link
                    to="/contact"
                    className="mt-4 px-4 py-3 bg-linear-to-b from-cyan-500 to-blue-500 text-white font-semibold rounded-lg text-center hover:from-cyan-600 hover:to-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get In Touch
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-size-[60px_60px] pointer-events-none"></div>
    </header>
  );
};

export default Header;