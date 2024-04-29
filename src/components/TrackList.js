import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AlbumContext } from '../contexts/AlbumContext';
import { MusicPlayerContext } from '../contexts/MusicPlayerContext';
import { getImageUrl } from '../services/PlexService'; // Import the getImageUrl function
import LoadingSpinner from '../core/loading/LoadingSpinner';
import '../core/style.css';

const TrackList = () => {
    const { albumId } = useParams();
    const { albumCache, selectAlbum, isLoading } = useContext(AlbumContext);
    const { playTrack, currentTrack, isPlaying } = useContext(MusicPlayerContext);
    const [album, setAlbum] = useState(null);

    const handleTrackClick = (trackIndex) => {
        const current = album.tracks[trackIndex];
        playTrack(current, album.tracks); // Send the whole track list for future plays
      };
    
      

    useEffect(() => {
        if (albumCache[albumId]) {
            setAlbum(albumCache[albumId]);
        } else {
            selectAlbum(albumId);
        }
    }, [albumId, albumCache, selectAlbum]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!album) {
        return <div>Loading album details...</div>;
    }

    return (
        <div className="tracklist-container">
            <div className="album-info">
                <img
                    src={album.thumb ? getImageUrl(album.thumb) : getImageUrl(null)}
                    alt={album.artist || 'Album Art'}
                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    onError={(e) => {
                        e.target.src = getImageUrl(null);
                    }}
                />
                <h3 className="album-artist">{album.parentTitle || 'Unknown Album'}</h3>
            </div>
            {album.tracks.map((track, index) => (
  <div key={track.ratingKey} className="track" onClick={() => handleTrackClick(index)}>
    <div className="track-details">
      <div className="track-title">{track.title}</div>
      <div className="artist-name">{track.grandparentTitle || 'Various Artists'}</div>
    </div>
    {currentTrack && currentTrack.ratingKey === track.ratingKey && (
      <div className={isPlaying ? "music-waves" : "music-dots"}>
        <div className={isPlaying ? "music-wave" : "music-dot"}></div>
        <div className={isPlaying ? "music-wave" : "music-dot"}></div>
        <div className={isPlaying ? "music-wave" : "music-dot"}></div>
      </div>
    )}
  </div>
))}



        </div>
    );
};

export default TrackList;
