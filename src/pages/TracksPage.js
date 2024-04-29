import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import TrackList from '../components/TrackList';
import { TrackContext } from '../contexts/TrackContext';
import { fetchAlbumDetails } from '../services/PlexService';
import LoadingSpinner from '../core/loading/LoadingSpinner';  // Make sure this import is correct

const TracksPage = () => {
  const { albumId } = useParams();
  const { tracks, setTracks, selectedAlbum, setSelectedAlbum, isLoading, setIsLoading } = useContext(TrackContext);

  useLayoutEffect(() => {
    setSelectedAlbum(null);
    setTracks([]);
  }, [albumId, setSelectedAlbum, setTracks]);

  useEffect(() => {
    setIsLoading(true);
    fetchAlbumDetails(albumId).then(data => {
      if (data && data.MediaContainer) {
        setSelectedAlbum({
          ...data.MediaContainer.Metadata[0], // Ensure you spread the metadata correctly if needed
          tracks: data.MediaContainer.Metadata  // Adjust according to data structure
        });
        setTracks(data.MediaContainer.Metadata || []);
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [albumId, setTracks, setSelectedAlbum, setIsLoading]);
  

  if (isLoading) {
    return (
      <div className="App">
        <LoadingSpinner />
      </div>
    );
  }

  if (!selectedAlbum) {
    return (
      <div className="App">
        <div>No album details found.</div>
      </div>
    );
  }

  return (
    <div className="App">
      <TrackList tracks={tracks} album={selectedAlbum} />
    </div>
  );
};

export default TracksPage;
