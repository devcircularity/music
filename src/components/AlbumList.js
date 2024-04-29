import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlbumContext } from '../contexts/AlbumContext';
import { getImageUrl } from '../services/PlexService'; // Make sure to import the new function

const AlbumList = () => {
  const { albums } = useContext(AlbumContext);
  const navigate = useNavigate();

  const onAlbumClick = (albumId) => {
    navigate(`/tracks/${albumId}`); // Navigate to the track details
  };

  if (!albums.length) {
    return <div>Loading albums...</div>;
  }

  return (
    <div className="album-list-container" style={{ marginTop: '70px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {albums.map(album => (
          <div 
            key={album.ratingKey}
            style={{
              width: '50%',
              padding: '10px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => onAlbumClick(album.ratingKey)}
          >
            <img
              src={getImageUrl(album.thumb)}
              alt={album.title}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null; // Prevent repeated error triggering
                e.target.src = getImageUrl(null); // Use the placeholder if there is an error
              }}
            />
            <div style={{ marginTop: '5px', textAlign: 'center' }}>{album.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumList;
