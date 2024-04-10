import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchMusicSections, fetchAlbumsFromSection, fetchAlbumDetails } from './services/PlexService';

function App() {
  const [sections, setSections] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMusicSections();
      if (data && data.MediaContainer && data.MediaContainer.Directory) {
        setSections(data.MediaContainer.Directory.filter(section => section.type === 'artist' || section.type === 'music'));
      }
    };
    fetchData();
  }, []);

  const handleSectionSelect = async (e) => {
    const sectionId = e.target.value;
    setSelectedSection(sectionId);
    setSelectedAlbum(null); // Reset selected album
    setTracks([]); // Reset tracks
    if (sectionId) {
      const data = await fetchAlbumsFromSection(sectionId);
      if (data && data.MediaContainer && data.MediaContainer.Metadata) {
        setAlbums(data.MediaContainer.Metadata);
      }
    } else {
      setAlbums([]);
    }
  };

  const handleAlbumSelect = async (albumId) => {
    setSelectedAlbum(albumId);
    const data = await fetchAlbumDetails(albumId); // `albumId` should be just the unique identifier
    if (data && data.MediaContainer && data.MediaContainer.Metadata) {
      setTracks(data.MediaContainer.Metadata);
    }
  };
  

  
  

  const playTrack = (track) => {
    const trackUrl = `http://localhost:32400${track.Media[0].Part[0].key}?X-Plex-Token=YOUR_PLEX_TOKEN`;
    console.log(trackUrl); // Ensure this URL is correct and accessible
    
    let audio = new Audio();
    audio.src = trackUrl;
    audio.addEventListener('canplaythrough', event => {
      /* the audio is now playable; play it if permissions allow */
      audio.play();
    });
    audio.addEventListener('error', event => {
      console.error('Error playing audio:', audio.error);
    });
  };
  

  return (
    <div className="App">
      <header className="App-header">
        <h1>Plex Music Library</h1>
        <div>
          <h2>Select a Music Section</h2>
          <select onChange={handleSectionSelect} value={selectedSection}>
            <option value="">Choose a section</option>
            {sections.map(section => (
              <option key={section.key} value={section.key}>{section.title}</option>
            ))}
          </select>
        </div>

        {albums.length > 0 && (
          <div>
            <h2>Albums</h2>
            <ul>
              {albums.map(album => (
                // Assuming `album.ratingKey` is the unique identifier for each album.
<li key={album.ratingKey} onClick={() => handleAlbumSelect(album.ratingKey)}>
  {album.title}
</li>

              
              ))}
            </ul>
          </div>
        )}

        {selectedAlbum && tracks.length > 0 && (
          <div>
            <h2>Tracks</h2>
            <ul>
              {tracks.map(track => (
                <li key={track.ratingKey} onClick={() => playTrack(track)}>
                  {track.index}. {track.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
