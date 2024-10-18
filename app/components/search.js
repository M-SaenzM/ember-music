import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SearchComponent extends Component {
  @service song;
  @service session;
  @service spotify;
  @service scrubbing; 
  @tracked query = '';
  @tracked searchTrackResults = [];
  @tracked searchAlbumResults = [];
  @tracked searchArtistResults = [];
  @service playbackState;

  get isPlaying() {
    return this.playbackState.isPlaying;
  }

  get playheadStyle() {
    const progress = (this.scrubbing.currentTime / this.scrubbing.duration) * 100;
    const style = `width: ${progress}%;`;
    return htmlSafe(style);
  }


  @action
  async search() {
    try {
      if (!this.query) {
        throw new Error('Search query is empty');
      }

      console.log('Performing search with query:', this.query);

      const { tracks, albums, artists } = await this.spotify.search(this.query);

      this.searchTrackResults = tracks;
      this.searchAlbumResults = albums;
      this.searchArtistResults = artists;
    } catch (error) {
      console.error('Error searching for music:', error);
    }
  }

  @action
  async playSong(trackUri, name, artists, album) {
    try {
      await this.spotify.playSong(trackUri);

      // Update the playback state
      this.playbackState.updatePlaybackState(name, artists[0].name, album.images[0].url);

      // Start updating the playback state periodically
      this.timeUpdateInterval = setInterval(async () => {
        const playbackState = await this.spotify.getPlaybackState();
        this.scrubbing.updatePlaybackState(playbackState);
      }, 1000);
    } catch (error) {
      console.error('Error playing song:', error);
    }
  }


  @action
  updateQuery(event) {
    this.query = event.target.value;
  }

  @action
  startScrubbing(event) {
    this.scrubbing.startScrubbing();
    this.scrubbing.handleScrubbing(event, this.currentTime, this.duration);
  }

  @action
  handleScrubbing(event) {
    this.scrubbing.handleScrubbing(event, this.currentTime, this.duration);
  }

  @action
  stopScrubbing() {
    this.scrubbing.stopScrubbing(this.currentTime);
  }
}
