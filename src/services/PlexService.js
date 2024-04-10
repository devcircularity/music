import axios from 'axios';

// If your development environment and Plex server are on the same machine, you can use localhost
const BASE_URL = 'http://localhost:32400';
const PLEX_TOKEN = 'Lim9WCiizgQJ79KSsygz';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {'X-Plex-Token': PLEX_TOKEN},
});

export const fetchMusicSections = async () => {
  try {
    const response = await axiosInstance.get('/library/sections');
    console.log('Music Sections:', response.data); // Add logging to see the fetched data
    return response.data;
  } catch (error) {
    console.error('Error fetching music sections:', error);
    return null;
  }
};

export const fetchAlbumsFromSection = async (sectionId) => {
  try {
    const response = await axiosInstance.get(`/library/sections/${sectionId}/albums`);
    console.log(`Albums from section ${sectionId}:`, response.data); // Add logging here as well
    return response.data;
  } catch (error) {
    console.error(`Error fetching albums from section ${sectionId}:`, error);
    return null;
  }
};

// Add this to PlexService.js

// In PlexService.js

export const fetchAlbumDetails = async (albumId) => {
    try {
      console.log(`Fetching album details for key: ${albumId}`); // Ensure this logs just the ID
      const response = await axiosInstance.get(`/library/metadata/${albumId}/children`);
      console.log(`Tracks from album ${albumId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for album ${albumId}:`, error);
      return null;
    }
  };
  

  
  