import React, { createContext, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAlbumDetails, getTrackUrl } from '../services/PlexService';  // Correct import of fetchAlbumDetails and getTrackUrl

export const TrackContext = createContext({
    tracks: [],
    selectedAlbum: null,
    setSelectedAlbum: () => {},
    isLoading: false,
    setIsLoading: () => {}
  });


export const TrackProvider = ({ children }) => {
  const { albumId } = useParams();
  const [tracks, setTracks] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayer = useRef(new Audio());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      fetchAlbumDetails(albumId).then(response => {
          if (response && response.MediaContainer) {
              setSelectedAlbum({
                  ...response.MediaContainer.Metadata[0],
                  tracks: response.MediaContainer.Metadata
              });
              setTracks(response.MediaContainer.Metadata || []);
          }
      });
  }, [albumId]);

  const handlePlayPauseClick = (track) => {
    const trackUrl = getTrackUrl(track.Media[0].Part[0].key);

    if (currentTrack && currentTrack.ratingKey === track.ratingKey) {
        if (isPlaying) {
            audioPlayer.current.pause();
        } else {
            audioPlayer.current.play();
        }
        setIsPlaying(!isPlaying); // Toggle playing state
    } else {
        // Set new track and play it
        const updatedTrack = {
            ...track,
            audioUrl: trackUrl,  // Ensure the audio URL is added to the track object
        };
        setCurrentTrack(updatedTrack);
        audioPlayer.current.src = trackUrl;
        audioPlayer.current.play();
        setIsPlaying(true);
    }
};


  




// Ensure TrackContext.Provider is wrapping all child components that require access to its context.
return (
  <TrackContext.Provider value={{
      tracks,
      setTracks,
      selectedAlbum,
      setSelectedAlbum,
      isLoading,
      setIsLoading,
      currentTrack,
      setCurrentTrack,
      isPlaying,
      setIsPlaying,
      handlePlayPauseClick,
  }}>
      {children}
  </TrackContext.Provider>
);

};