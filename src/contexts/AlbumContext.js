import React, { createContext, useState, useEffect } from 'react';
import { fetchAllAlbums, fetchAlbumDetails } from '../services/PlexService';

export const AlbumContext = createContext();

export const AlbumProvider = ({ children }) => {
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const [albumCache, setAlbumCache] = useState({});

    useEffect(() => {
        fetchAllAlbums().then(data => {
            if (data) {
                setAlbums(data);
            }
        });
    }, []);

    const selectAlbum = async (albumId) => {
        if (albumCache[albumId]) {
            setSelectedAlbum(albumCache[albumId]);
        } else {
            setIsLoading(true); // Set loading to true before fetching
            const albumDetails = await fetchAlbumDetails(albumId);
            if (albumDetails && albumDetails.MediaContainer) {
                const detailedAlbum = {
                    ...albumDetails.MediaContainer.Metadata[0],
                    tracks: albumDetails.MediaContainer.Metadata
                };
                setAlbumCache(prevCache => ({ ...prevCache, [albumId]: detailedAlbum }));  // Update cache
                setSelectedAlbum(detailedAlbum);
            }
            setIsLoading(false); // Reset loading to false after fetching
        }
    };
    

    return (
        <AlbumContext.Provider value={{ albums, selectedAlbum, selectAlbum, albumCache, isLoading }}>
            {children}
        </AlbumContext.Provider>
    );
};

export default AlbumProvider;
