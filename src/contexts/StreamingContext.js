import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const StreamingContext = createContext(null);

export const StreamingProvider = ({ children }) => {
    const audioRef = useRef(new Audio());
    const mediaSource = useRef(new MediaSource());
    const sourceBuffer = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);

    useEffect(() => {
        audioRef.current.src = URL.createObjectURL(mediaSource.current);
        mediaSource.current.addEventListener('sourceopen', onMediaSourceOpen, false);
    }, []);

    const onMediaSourceOpen = () => {
        sourceBuffer.current = mediaSource.current.addSourceBuffer('audio/mp4; codecs="mp4a.40.2"');
        mediaSource.current.removeEventListener('sourceopen', onMediaSourceOpen, false);
        loadInitialTrackSegment();
    };

    const loadInitialTrackSegment = () => {
        // This should be adapted to fetch the initial segment of the current track
        // For demonstration, this is just a placeholder
    };

    const loadTrack = async (trackUrl) => {
        try {
            const response = await fetch(trackUrl);
            const data = await response.arrayBuffer();
            sourceBuffer.current.appendBuffer(data);
            setCurrentTrack(trackUrl);
        } catch (error) {
            console.error('Error loading track:', error);
        }
    };

    const play = () => {
        audioRef.current.play()
            .then(() => {
                setIsPlaying(true);
            })
            .catch(error => {
                console.error("Error playing track:", error);
            });
    };

    const pause = () => {
        audioRef.current.pause();
        setIsPlaying(false);
    };

    return (
        <StreamingContext.Provider value={{
            play,
            pause,
            loadTrack,
            isPlaying,
            currentTrack,
            audioElement: audioRef.current
        }}>
            {children}
        </StreamingContext.Provider>
    );
};

export const useStreaming = () => useContext(StreamingContext);
