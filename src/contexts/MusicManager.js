import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchMusicSections, fetchAlbumsFromSection, fetchAlbumDetails } from '../services/PlexService';
import axios from 'axios'; // Assuming axios is used for API calls


// Context creation
const MusicContext = createContext(null);

// Provider component
export const MusicProvider = ({ children }) => {
    const [albums, setAlbums] = useState([]);
    const [tracks, setTracks] = useState({});
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [selectedAlbumDetails, setSelectedAlbumDetails] = useState(null);
    const [audioPlayer, setAudioPlayer] = useState(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
    const [showExpandedPlayer, setShowExpandedPlayer] = useState(false);
    const [lastUpdated, setLastUpdated] = useState('');
    const [albumArtCache, setAlbumArtCache] = useState({});
    const [nextAudioPlayer, setNextAudioPlayer] = useState(null);


    // Direct use of environment variables
    const baseURL = process.env.REACT_APP_PLEX_URL;
    const token = process.env.REACT_APP_PLEX_TOKEN;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sectionData = await fetchMusicSections();
                if (sectionData && sectionData.MediaContainer && sectionData.MediaContainer.Directory) {
                    const musicSection = sectionData.MediaContainer.Directory.find(section => section.type === 'artist');
                    if (musicSection) {
                        const albumsData = await fetchAlbumsFromSection(musicSection.key);
                        console.log("Fetched albums data:", albumsData);
                        setAlbums(albumsData.MediaContainer.Metadata);
                    }
                }
            } catch (error) {
                console.error("Error fetching albums:", error);
            }
        };
        fetchData();
    }, []);
    

    

    // Function to fetch albums
    const fetchAlbums = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/albums`);
            setAlbums(response.data.albums);
            setLastUpdated(response.data.lastUpdated); // Assuming 'lastUpdated' is a timestamp provided by your backend
        } catch (error) {
            console.error("Failed to fetch albums:", error);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchAlbums();
    }, []);

    // Polling logic
    useEffect(() => {
        const interval = setInterval(() => {
            fetchAlbums();
        }, 60000); // Polling every 60 seconds

        return () => clearInterval(interval);
    }, []);

    const preloadAlbumArts = (albums) => {
        albums.forEach(album => {
            if (album.thumb && !albumArtCache[album.thumb]) {
                const img = new Image();
                img.src = `${process.env.REACT_APP_PLEX_URL}${album.thumb}?X-Plex-Token=${process.env.REACT_APP_PLEX_TOKEN}`;
                img.onload = () => setAlbumArtCache(prev => ({ ...prev, [album.thumb]: img.src }));
            }
        });
    };

    const handleAlbumSelect = async (albumId) => {
        let albumTracks = tracks[albumId];
        if (!albumTracks) {
            const albumDetails = await fetchAlbumDetails(albumId);
            if (albumDetails && albumDetails.MediaContainer && albumDetails.MediaContainer.Metadata) {
                albumTracks = albumDetails.MediaContainer.Metadata;
                setTracks(prevTracks => ({ ...prevTracks, [albumId]: albumTracks }));
                      preloadAlbumArts(albumTracks); // Preload album arts

            }
        }
        const selectedAlbum = albums.find(album => album.ratingKey === albumId);
        setSelectedAlbum(selectedAlbum.ratingKey);
        setSelectedAlbumDetails(selectedAlbum);
        setCurrentTrackIndex(0); // Reset track index when album changes
        return albumTracks ? true : false;
    };

    const preloadAudio = (trackUrl) => {
        const audio = new Audio(trackUrl);
        audio.load(); // This starts loading the audio but doesn't play it
        return audio; // Return the loaded audio element
    };

    const handleTrackSelect = async (trackId, albumId) => {
    const albumTracks = tracks[albumId] || [];
    const trackIndex = albumTracks.findIndex(track => track.ratingKey === trackId);

    if (trackIndex === -1) {
        console.error("Track details not found");
        return;
    }

    const trackDetails = albumTracks[trackIndex];
    setCurrentTrack(trackDetails);
    
    const audioSrc = `${baseURL}${trackDetails.Media[0].Part[0].key}?X-Plex-Token=${token}`;
    audioPlayer.src = audioSrc;
    audioPlayer.load();

    try {
        await audioPlayer.play();
        setIsPlaying(true);
        setCurrentTrackIndex(trackIndex);
        setCurrentTrack({
            title: trackDetails.title,
            artist: trackDetails.grandparentTitle,
            albumArt: trackDetails.thumb ? `${baseURL}${trackDetails.thumb}?X-Plex-Token=${token}` : 'path/to/default/image.jpg',
            audioSrc: audioSrc,
            duration: trackDetails.duration
        });

        // Preload the next track
        const nextTrackIndex = (trackIndex + 1) % albumTracks.length;
        const nextTrack = albumTracks[nextTrackIndex];
        if (nextTrack) {
            const nextAudioSrc = `${baseURL}${nextTrack.Media[0].Part[0].key}?X-Plex-Token=${token}`;
            const nextAudioPlayer = new Audio(nextAudioSrc);
            nextAudioPlayer.load();  // Preload the next track
            setNextAudioPlayer(nextAudioPlayer);  // Assuming you have a state or context to hold the preloaded audio player
        }
    } catch (error) {
        console.error('Error occurred while trying to play the track:', error);
        setIsPlaying(false);
    }
};


    const handleNextTrack = () => {
        if (!selectedAlbum || !tracks[selectedAlbum] || tracks[selectedAlbum].length === 0) {
            console.error("No selected album or tracks found.");
            return;
        }
        const nextIndex = (currentTrackIndex + 1) % tracks[selectedAlbum].length;
        const nextTrackId = tracks[selectedAlbum][nextIndex].ratingKey;
        handleTrackSelect(nextTrackId, selectedAlbum);
    };

    const handlePreviousTrack = () => {
        if (!selectedAlbum || !tracks[selectedAlbum] || tracks[selectedAlbum].length === 0) {
            console.error("No selected album or tracks found.");
            return;
        }
        const prevIndex = (currentTrackIndex - 1 + tracks[selectedAlbum].length) % tracks[selectedAlbum].length;
        const prevTrackId = tracks[selectedAlbum][prevIndex].ratingKey;
        handleTrackSelect(prevTrackId, selectedAlbum);
    };

    useEffect(() => {
        const handleTrackEnd = () => {
            handleNextTrack();
        };
    
        audioPlayer.addEventListener('ended', handleTrackEnd);
    
        return () => {
            audioPlayer.removeEventListener('ended', handleTrackEnd);
        };
    }, [audioPlayer, handleNextTrack]);
    
    const handlePlayPauseClick = () => {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleExpandedView = () => {
        setShowExpandedPlayer(!showExpandedPlayer);
    };

    const toggleExpandedPlayer = () => {
        setShowExpandedPlayer(prevState => !prevState);
    };

    const minimizeExpandedPlayer = () => {
        setShowExpandedPlayer(false);
    };

    return (
        <MusicContext.Provider value={{
            albums,
            tracks,
            selectedAlbum,
            selectedAlbumDetails,
            audioPlayer,
            isPlaying,
            currentTrack,
            currentTrackIndex,
            showExpandedPlayer,
            albumArtCache,
            setIsPlaying,
            handleAlbumSelect,
            handleTrackSelect,
            handleNextTrack,
            handlePreviousTrack,
            handlePlayPauseClick,
            toggleExpandedPlayer,
            toggleExpandedView,
            minimizeExpandedPlayer
        }}>
            {children}
        </MusicContext.Provider>
    );
};

// Custom hook for easy access to music context
export const useMusic = () => useContext(MusicContext);
