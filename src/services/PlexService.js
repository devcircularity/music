import axios from 'axios';

const BASE_URL = process.env.REACT_APP_PLEX_URL || 'https://music.circularityspace.com';
const PLEX_TOKEN = process.env.REACT_APP_PLEX_TOKEN || 'wW1sHzmy96PpYujuU_Lo';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {'X-Plex-Token': PLEX_TOKEN},
});

// Function to fetch all music sections
export const fetchMusicSections = async () => {
  try {
    const response = await axiosInstance.get('/library/sections');
    return response.data.MediaContainer.Directory;
  } catch (error) {
    console.error('Error fetching music sections:', error);
    return [];
  }
};


// Function to fetch albums from a specific section
export const fetchAlbums = async (sectionId) => {
  try {
    const response = await axiosInstance.get(`/library/sections/${sectionId}/albums`);
    return response.data.MediaContainer.Metadata;
  } catch (error) {
    console.error("Failed to fetch albums:", error);
    return [];
  }
};

export const fetchAllAlbums = async () => {
  try {
    const sections = await fetchMusicSections();
    if (!Array.isArray(sections)) {
      console.error('No sections available or sections are not iterable:', sections);
      return [];
    }

    let allAlbums = [];
    for (let section of sections) {
      const albumsResponse = await axiosInstance.get(`/library/sections/${section.key}/albums`);
      allAlbums = allAlbums.concat(albumsResponse.data.MediaContainer.Metadata);
    }

    return allAlbums;
  } catch (error) {
    console.error('Error fetching all albums:', error);
    return [];
  }
};



export const preloadTracks = async (trackIds) => {
  const tracks = [];
  for (const id of trackIds) {
    try {
      const response = await axiosInstance.get(`/library/metadata/${id}`);
      tracks.push(response.data);
    } catch (error) {
      console.error(`Error preloading track ${id}:`, error);
    }
  }
  return tracks;
};


// In PlexService.js

// In PlexService.js

// In PlexService.js

// In PlexService.js

export const getImageUrl = (thumbnailPath) => {
  if (!thumbnailPath) return 'path/to/your/placeholder/image.jpg';
  return `${BASE_URL}${thumbnailPath}?X-Plex-Token=${PLEX_TOKEN}`;
};






// Function to fetch details of a specific album
// In PlexService.js

export const fetchAlbumDetails = async (albumId) => {
  try {
    const response = await axiosInstance.get(`/library/metadata/${albumId}/children`);
    console.log("Album Details Response:", response.data); // Log the full response data

    // Attempt to extract thumbnail path with fallback
    const thumbnailPath = response.data.MediaContainer.thumb || response.data.MediaContainer.Metadata[0]?.thumb;


    return {
      ...response.data,
      thumbnailPath,  // Include the thumbnail path in the returned object for easier access
    };
  } catch (error) {
    console.error(`Error fetching details for album ${albumId}:`, error);
    return null;
  }
};




// Function to generate a URL for a track
export const getTrackUrl = (partKey) => {
  return `${BASE_URL}${partKey}?X-Plex-Token=${PLEX_TOKEN}`;
};




