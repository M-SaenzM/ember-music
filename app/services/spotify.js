import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class SpotifyService extends Service {
  @service session;
  @service playbackState;

  async playSong(trackUri) {
    try {
      const accessToken = this.session.accessToken;

      const response = await fetch(
        'https://api.spotify.com/v1/me/player/play',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uris: [trackUri],
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to play song');
      }

      console.log('Song is playing');
    } catch (error) {
      console.error('Error playing song:', error);
    }
  }

  async search(query) {
    try {
      const accessToken = this.session.accessToken;

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,album,artist&limit=6`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to search');
      }

      const data = await response.json();
      return {
        tracks: data.tracks.items,
        albums: data.albums.items,
        artists: data.artists.items,
      };
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  }

  async play() {
    try {
      const accessToken = this.session.accessToken;

      if (!accessToken) {
        throw new Error('Access token is not available');
      }

      const response = await fetch(
        'https://api.spotify.com/v1/me/player/play',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No active Spotify device found');
        } else {
          throw new Error('Failed to resume song');
        }
      }

      if (!response.ok) {
        throw new Error('Failed to resume song');
      }

    } catch (error) {
      console.error('Error resuming song:', error);
    }
  }

  async pause() {
    try {
      const accessToken = this.session.accessToken;

      if (!accessToken) {
        throw new Error('Access token is not available');
      }

      const response = await fetch(
        'https://api.spotify.com/v1/me/player/pause',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      
      if (!response.ok) {
        throw new Error('Failed to pause song');
      }

    } catch (error) {
      console.error('Error pausing song:', error);
    }
  }

  async getPlaybackState() {
    try {
      const accessToken = this.session.accessToken;

      const response = await fetch('https://api.spotify.com/v1/me/player', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch playback state');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching playback state:', error);
      return null;
    }
  }

  async seekPlayback(position_ms) {
    try {
      console.log('Position_ms:', position_ms);

      if (!position_ms || isNaN(position_ms)) {
        throw new Error('Invalid or missing position_ms parameter');
      }

      const accessToken = this.session.accessToken;
      const url = `https://api.spotify.com/v1/me/player/seek?position_ms=${position_ms}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to seek playback');
      }

      console.log('Playback position updated successfully');
    } catch (error) {
      console.error('Error seeking playback:', error);
    }
  }
}
