// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AlbumProvider } from './contexts/AlbumContext';
import { TrackProvider } from './contexts/TrackContext'; // Import TrackProvider
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import Header from './components/Header'; // Import the Header component
import AlbumsPage from './pages/AlbumsPage';
import TracksPage from './pages/TracksPage';
import PlayerBar from './components/PlayerBar'; // PlayerBar component

function App() {
  return (
    <Router>
      <AlbumProvider>
        <TrackProvider>
          <MusicPlayerProvider>
          <Header /> {/* Add the Header outside of Routes to show on all pages */}
            <Routes>
              <Route path="/" element={<AlbumsPage />} />
              <Route path="/tracks/:albumId" element={<TracksPage />} />
            </Routes>
            <PlayerBar />
          </MusicPlayerProvider>
        </TrackProvider>
      </AlbumProvider>
    </Router>
  );
}

export default App;
