// AlbumsPage.js
import React, { useContext } from 'react'; // Add useContext here
import AlbumList from '../components/AlbumList';
import { useNavigate } from 'react-router-dom';
import { AlbumContext } from '../contexts/AlbumContext';

const AlbumsPage = () => {
  const navigate = useNavigate();
  const { albums, selectAlbum } = useContext(AlbumContext);

  const handleAlbumSelect = (albumId) => {
    selectAlbum(albumId); // Set selected album in context
    navigate(`/tracks/${albumId}`); // Navigate to the tracks page with album ID
  };

  return (
    <div className="App">
      <AlbumList albums={albums} onAlbumSelect={handleAlbumSelect} />
    </div>
  );
};

export default AlbumsPage;
