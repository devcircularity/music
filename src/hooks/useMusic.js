// src/hooks/useMusic.js
import { useContext } from 'react';
import { AlbumContext } from '../contexts/AlbumContext';
import { TrackContext } from '../contexts/TrackContext';

export const useMusic = () => {
    const { albums, selectedAlbum } = useContext(AlbumContext);
    const { currentTrack, isPlaying, handlePlayPauseClick } = useContext(TrackContext);

    return {
        albums,
        currentTrack,
        isPlaying,
        handlePlayPauseClick,
        selectedAlbum,
    };
};
