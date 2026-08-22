import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaClock, FaArrowRight, FaSearch } from 'react-icons/fa';
import { blogPosts } from '../data/travelData';
import AnimatedSection from '../components/AnimatedSection';
import './BlogPage.css';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ['All', 'Hill Stations', 'Pilgrimage', 'International'];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="blog-page">
      {/* Banner */}
      <div className="page-header-banner">
        <div className="container">
          <AnimatedSection anim="fade-down" delay="100" className="section-tag">TRAVEL GUIDES & TIPS</AnimatedSection>
          <AnimatedSection as="h1" anim="fade-up" delay="200">SPOT TOURS <span>TRAVEL BLOG</span></AnimatedSection>
          <AnimatedSection as="p" anim="fade-up" delay="300">Expert travel advice, custom itinerary guides, temple circuits, and packing tips from Coimbatore travel specialists.</AnimatedSection>
        </div>
      </div>

      <div className="container blog-container">
        {/* Search & Categories */}
        <div className="blog-filter-bar">
          <div className="blog-categories">
            {categories.map((cat) => (
              <button 
                key={cat} 
                className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="blog-search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search travel guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Blog Grid */}
        <div className="blog-grid">
          {filteredPosts.map((post, idx) => (
            <AnimatedSection as="article" key={post.id} anim="fade-up" delay={String((idx % 3) * 150 + 100)} className="blog-card">
              <div className="blog-img-wrap">
                <img src={post.image} alt={post.title} loading="lazy" />
                <span className="blog-cat-badge">{post.category}</span>
              </div>

              <div className="blog-card-body">
                <div className="blog-meta">
                  <span><FaCalendarAlt /> {post.date}</span>
                  <span><FaClock /> {post.readTime}</span>
                </div>

                <h2>{post.title}</h2>
                <p className="blog-excerpt">{post.excerpt}</p>

                <div className="blog-card-footer">
                  <span className="author-name"><FaUser /> {post.author}</span>
                  <Link to={`/blog/${post.slug}`} className="read-more-btn">
                    Read Article <FaArrowRight />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
