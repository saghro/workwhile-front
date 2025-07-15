import React, { useState, useEffect } from 'react';
import Header from '../components/CompanyReviewPage/Header';
import SearchBar from '../components/CompanyReviewPage/SearchBar';
import CompanyList from '../components/CompanyReviewPage/CompanyList';
import ReviewCarousel from '../components/CompanyReviewPage/ReviewCarousel';
import CallToAction from '../components/CompanyReviewPage/CallToAction';
import IndustryCategories from '../components/CompanyReviewPage/IndustryCategories';
import { companies, reviewsData } from '../components/CompanyReviewPage/data.js';

const CompanyReviewPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState(companies);
  const [carouselPosition, setCarouselPosition] = useState(0);
  
  // For infinite scrolling effect
  const [reviews, setReviews] = useState([...reviewsData, ...reviewsData, ...reviewsData]);
  const [autoScroll, setAutoScroll] = useState(true);
  
  // Handle search input
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(company => 
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery]);
  
  // Auto-scroll carousel effect
  useEffect(() => {
    let interval;
    
    if (autoScroll) {
      interval = setInterval(() => {
        setCarouselPosition(prev => {
          const newPosition = prev + 1;
          // Reset position to create infinite effect when we reach the end
          if (newPosition > reviewsData.length * 3 - 1) {
            return 0;
          }
          return newPosition;
        });
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoScroll, reviewsData.length]);
  
  // Pause auto-scroll on hover
  const handleMouseEnter = () => setAutoScroll(false);
  const handleMouseLeave = () => setAutoScroll(true);
  
  // Manual carousel navigation
  const handlePrevReview = () => {
    setCarouselPosition(prev => {
      const newPosition = prev - 1;
      if (newPosition < 0) {
        return reviews.length - 1;
      }
      return newPosition;
    });
  };
  
  const handleNextReview = () => {
    setCarouselPosition(prev => {
      const newPosition = prev + 1;
      if (newPosition > reviews.length - 1) {
        return 0;
      }
      return newPosition;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CompanyList companies={filteredCompanies} />
      <ReviewCarousel 
        reviews={reviews}
        companies={companies}
        carouselPosition={carouselPosition}
        handlePrevReview={handlePrevReview}
        handleNextReview={handleNextReview}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
      <CallToAction />
      <IndustryCategories />
    </div>
  );
};

export default CompanyReviewPage;