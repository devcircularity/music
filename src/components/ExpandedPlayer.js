import React, { useContext, useEffect, useState, useCallback } from 'react';
import { TrackContext } from '../contexts/TrackContext';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import ColorThief from 'colorthief';
import '../core/style.css';

const ExpandedPlayer = ({ showExpandedPlayer, minimizeExpandedPlayer }) => {
  const {
    currentTrack,
    isPlaying,
    handlePlayPauseClick,
    handleNextTrack,
    handlePreviousTrack
  } = useContext(TrackContext);

  const [bgColor, setBgColor] = useState('rgba(255, 255, 255, 0.8)');
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const audioPlayer = new Audio();  // This should likely be managed with state or refs


  useEffect(() => {
    const updateProgress = () => {
      const buffered = audioPlayer.buffered;
      if (buffered.length > 0) {
        const bufferedEnd = buffered.end(buffered.length - 1);
        const duration = audioPlayer.duration;
        if (duration > 0) {
          setBufferedTime((bufferedEnd / duration) * 100);
        }
      }
    };

    audioPlayer.addEventListener('progress', updateProgress);

    return () => {
      audioPlayer.removeEventListener('progress', updateProgress);
    };
  }, [audioPlayer]);


  useEffect(() => {
    const updateCurrentTime = () => {
      if (!isDragging && audioPlayer) {
        setCurrentTime(audioPlayer.currentTime * 1000);
        requestAnimationFrame(updateCurrentTime);
      }
    };
    updateCurrentTime();
  }, [audioPlayer, isDragging]);


  useEffect(() => {
    if (currentTrack && currentTrack.albumArt) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = currentTrack.albumArt;
      img.onload = () => {
          const colorThief = new ColorThief();
          const [r, g, b] = colorThief.getColor(img);
          setBgColor(`rgba(${r}, ${g}, ${b}, 0.8)`);
      };
      img.onerror = () => {
          setBgColor('rgba(255, 255, 255, 0.8)');
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    const handleScroll = () => {
        console.log('minimizeExpandedPlayer is: ', minimizeExpandedPlayer);
        minimizeExpandedPlayer(); // This should log the function, verifying it's passed correctly.
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
}, [minimizeExpandedPlayer]);  // Dependency array includes minimizeExpandedPlayer


    // Use the currentTrack to change the source of audioPlayer when track changes
    useEffect(() => {
      if (currentTrack && currentTrack.mediaUrl) {
        audioPlayer.src = currentTrack.mediaUrl; // Assuming mediaUrl is your track's playable URL
        if (isPlaying) {
          audioPlayer.play();
        }
      }
    }, [currentTrack, audioPlayer, isPlaying]);

  useEffect(() => {
    if (showExpandedPlayer) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  
    return () => {
      document.body.classList.remove("no-scroll"); // Clean up on component unmount
    };
  }, [showExpandedPlayer]);
  
  useEffect(() => {
    console.log('Component Mounted. minimizeExpandedPlayer:', minimizeExpandedPlayer);
    return () => console.log('Component Unmounted.');
}, []);

useEffect(() => {
    console.log('minimizeExpandedPlayer updated:', minimizeExpandedPlayer);
}, [minimizeExpandedPlayer]);


  const handleSeekChange = useCallback((event) => {
    if (!currentTrack) return;
    const newTime = (event.target.value / 100) * currentTrack.duration;
    setCurrentTime(newTime);
    if (!isDragging && audioPlayer) {
      audioPlayer.currentTime = newTime / 1000;
    }
  }, [currentTrack?.duration, isDragging, audioPlayer]);

  const formatTime = (timeInMilliseconds) => {
    const totalSeconds = Math.floor(timeInMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleMinimize = () => {
    setIsMinimizing(true);
    setTimeout(() => {
      minimizeExpandedPlayer();
      setIsMinimizing(false);
    }, 500); // Ensure this matches the duration of the CSS transition
  };

  if (!showExpandedPlayer) return null;
return (
  <>
    <div className="expanded-player-overlay" onClick={minimizeExpandedPlayer}></div>
    <div className={`expanded-player ${isMinimizing ? 'minimizing' : ''}`} style={{ backgroundColor: bgColor }}>
      <div className="top-bar">
        <IconButton onClick={minimizeExpandedPlayer} size="large" sx={{ color: 'white' }}>
          <ExpandMoreIcon />
        </IconButton>
        <div className="artist-name">{currentTrack.artist}</div>
        <div className="spacer"></div>
      </div>
      <img 
        src={currentTrack.albumArt || 'path/to/default/image.jpg'} 
        alt={currentTrack.title || 'No title'} 
        className="expanded-album-art"
        onError={(e) => { e.target.onerror = null; e.target.src = 'path/to/default/image.jpg'; }}
      />
      <div className="track-info">
        <div className="track-title">{currentTrack.title}</div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={(currentTime / currentTrack.duration) * 100 || 0}
        onChange={handleSeekChange}
        className="seek-bar"
      />
      <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            backgroundColor: 'rgba(100,100,250,0.5)',
            width: `${bufferedTime}%`
          }}></div>
      <div className="time-info">{formatTime(currentTime)} / {formatTime(currentTrack.duration)}</div>
      
      <div className="controls">
        <IconButton onClick={handlePreviousTrack} className="control-button prev">
          <SkipPreviousIcon fontSize="large" />
        </IconButton>
        <IconButton onClick={() => handlePlayPauseClick(!isPlaying)} className="control-button playpause">
          {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
        </IconButton>
        <IconButton onClick={handleNextTrack} className="control-button next">
          <SkipNextIcon fontSize="large" />
        </IconButton>
      </div>
    </div>
  </>
);

};

export default ExpandedPlayer;
