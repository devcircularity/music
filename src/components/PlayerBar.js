import React, { useContext } from 'react';
import { MusicPlayerContext } from '../contexts/MusicPlayerContext';
import { getImageUrl } from '../services/PlexService';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import '../core/PlayerBar.css';

const PlayerBar = () => {
    const { currentTrack, isPlaying, togglePlay, currentTime, progress } = useContext(MusicPlayerContext);

    if (!currentTrack) return null;

    const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
    const albumArt = getImageUrl(currentTrack.parentThumb || currentTrack.grandparentThumb);

    return (
        <div className="player-bar">
            <div className="content">
                <img src={albumArt} alt={currentTrack.title} className="album-art" onError={(e) => { e.target.src = getImageUrl(null); }} />
                <div className="track-details">
                    <span className="track-name">{currentTrack.title}</span>
                    <span className="artist-name">{currentTrack.originalTitle || currentTrack.grandparentTitle}</span>
                </div>
                <div className="controls">
                    <IconButton onClick={togglePlay} color="primary" aria-label={isPlaying ? 'Pause' : 'Play'}>
                        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                </div>
            </div>
            <input
                type="range"
                min="0"
                max="100"
                value={progress || 0}
                onChange={(e) => {/* handle seek */}}
                className="progress-bar"
                style={{ '--progress-percentage': `${progress}%` }}
            />
        </div>
    );
};

export default PlayerBar;
