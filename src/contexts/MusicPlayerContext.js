import React, { createContext, useState, useRef, useEffect } from 'react';
import { getTrackUrl, getImageUrl } from '../services/PlexService';

export const MusicPlayerContext = createContext({
  currentTrack: null,
  isPlaying: false,
  playTrack: () => {},
  togglePlay: () => {},
  currentTime: 0,
  progress: 0
});

export const MusicPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [nextTrack, setNextTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioPlayer = useRef(new Audio());
  const [albumArtUrl, setAlbumArtUrl] = useState('');
  const [tracks, setTracks] = useState([]); // Holds the list of tracks for continuous play


  const playTrack = (track, trackList) => {
    if (trackList) {
      setTracks(trackList); // Update the full list of tracks when a new track is played
    }
    if (track) {
      const trackUrl = getTrackUrl(track.Media[0].Part[0].key);
      audioPlayer.current.src = trackUrl;
      audioPlayer.current.play();
      setCurrentTrack(track);
      setIsPlaying(true);

      // Find the index of the current track
      const currentIndex = trackList.findIndex(t => t.ratingKey === track.ratingKey);
      const nextTrack = trackList[currentIndex + 1] || null;
      setNextTrack(nextTrack); // Set the next track
    }
  };

  useEffect(() => {
    const handleTrackEnd = () => {
      if (nextTrack) {
        playTrack(nextTrack, tracks); // Play the next track using the updated list
      } else {
        setIsPlaying(false); // Stop playback if no next track
      }
    };

    audioPlayer.current.addEventListener('ended', handleTrackEnd);
    return () => {
      audioPlayer.current.removeEventListener('ended', handleTrackEnd);
    };
  }, [nextTrack, tracks]);

  const togglePlay = () => {
    if (isPlaying) {
      audioPlayer.current.pause();
    } else {
      audioPlayer.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const handleTimeUpdate = () => {
      setCurrentTime(audioPlayer.current.currentTime);
      setProgress((audioPlayer.current.currentTime / audioPlayer.current.duration) * 100);
    };

    audioPlayer.current.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audioPlayer.current.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  return (
    <MusicPlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      playTrack,
      nextTrack,
      tracks,
      setTracks,
      togglePlay,
      currentTime,
      progress,
      albumArtUrl
    }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};