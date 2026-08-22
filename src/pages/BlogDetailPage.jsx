import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaClock, FaArrowLeft, FaPhoneAlt, FaWhatsapp, FaShareAlt } from 'react-icons/fa';
import { blogPosts, agencyInfo } from '../data/travelData';
import AnimatedSection from '../components/AnimatedSection';
import './BlogDetailPage.css';

const BlogDetailPage = () => {
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const post = blogPosts.find(p => p.slug === slug) || blogPosts[0];

  return (
    <div className="blog-detail-page">
      <div className="detail-top-nav">
        <div className="container">
          <Link to="/blog" className="back-link">
            <FaArrowLeft /> Back to Travel Blog
          </Link>
        </div>
      </div>

      <AnimatedSection as="article" anim="fade-up" className="container blog-detail-container">
        <AnimatedSection as="header" anim="fade-down" delay="100" className="article-header">
          <span className="article-category-badge">{post.category}</span>
          <h1>{post.title}</h1>
          
          <div className="article-meta-row">
            <span><FaUser /> {post.author}</span>
            <span><FaCalendarAlt /> {post.date}</span>
            <span><FaClock /> {post.readTime}</span>
          </div>
        </AnimatedSection>

        <div className="article-hero-image">
          <img src={post.image} alt={post.title} />
        </div>

        <div className="article-content-body">
          <p className="article-lead-text">{post.excerpt}</p>
          
          <div className="article-markdown" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n\n/g, '<br/><br/>').replace(/### (.*?)\n/g, '<h3>$1</h3>').replace(/- \*\*(.*?)\*\*: (.*?)\n/g, '<li><strong>$1:</strong> $2</li>') }} />
        </div>

        {/* Travel Agency Callout in Blog */}
        <AnimatedSection anim="zoom-in" dur="slow" className="blog-agency-callout">
          <div className="callout-text">
            <h3>Plan This Trip With Spot Tours and Travels</h3>
            <p>We arrange door-to-door AC tourist cabs, verified star hotels, and customized sightseeing from Kuniyamuthur, Coimbatore.</p>
          </div>
          <div className="callout-actions">
            <a href={`tel:${agencyInfo.phoneRaw}`} className="btn-secondary">
              <FaPhoneAlt /> Call {agencyInfo.phone}
            </a>
            <a 
              href={`https://wa.me/${agencyInfo.whatsappRaw}?text=Hi%20Spot%20Tours,%20I%20read%20your%20blog%20post%20about%20${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp"
            >
              <FaWhatsapp /> Enquire on WhatsApp
            </a>
          </div>
        </AnimatedSection>
      </AnimatedSection>
    </div>
  );
};

export default BlogDetailPage;
