import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRootRoute = location.pathname === '/'; // Check if the current route is the root route
  const isAlbumRoute = location.pathname.includes('/tracks/'); // Check if the URL includes '/tracks/'

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className={`App-header ${isAlbumRoute ? 'transparent' : ''}`}>
      {isAlbumRoute && (
        <IconButton onClick={handleBack} className="back-button">
          <ArrowBackIcon />
        </IconButton>
      )}
      {/* Render "Craftr" text only on the root route */}
      {isRootRoute && <h1>Craftr</h1>}
      {/* Optionally, render other titles or elements for different routes here */}
    </header>
  );
};

export default Header;
