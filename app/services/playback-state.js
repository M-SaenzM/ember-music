// app/services/playback-state.js
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class PlaybackStateService extends Service {
  @service spotify; // Inject SpotifyService

  @tracked isPlaying = false;
  @tracked currentSongTitle = 'Unknown';
  @tracked currentArtistName = 'Unknown';
  @tracked currentAlbumCoverUrl = 'assets/unknown-track.jpg';

  @tracked timeUpdateInterval = null; // Interval reference

  constructor() {
    super(...arguments);
    // Start updating playback state periodically
    this.startPlaybackStateUpdate();
  }

  startPlaybackStateUpdate() {
    // Update playback state every second
    this.timeUpdateInterval = setInterval(async () => {
      const playbackState = await this.spotify.getPlaybackState();
      this.updatePlaybackState(playbackState);
    }, 1000);
  }

  async updatePlaybackState(playbackState) {
    try {
      if (playbackState && playbackState.item) {
        const { name: songName, artists: songArtists, album: songAlbum } = playbackState.item;
        this.currentSongTitle = songName || 'Unknown';
        this.currentArtistName = (songArtists && songArtists[0].name) || 'Unknown';
        this.currentAlbumCoverUrl = (songAlbum && songAlbum.images && songAlbum.images[0].url) || 'assets/unknown-track.jpg';

        // Log default values if needed
        if (!songName || !songArtists || !songAlbum || !songAlbum.images || !songAlbum.images[0].url) {
          console.warn('One or more properties were undefined. Default values used.');
        }
      } else {
        // Reset the song details if no song is playing
        this.currentSongTitle = 'Unknown';
        this.currentArtistName = 'Unknown';
        this.currentAlbumCoverUrl = 'assets/unknown-track.jpg';
      }

      // Update isPlaying based on the playback state
      this.isPlaying = playbackState && playbackState.is_playing;
    } catch (error) {
      console.error('Error updating playback state:', error);
    }
  }
}
