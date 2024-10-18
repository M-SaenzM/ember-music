import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PlaylistDisplayComponent extends Component {
  @service() song;
  @service spotify;
  @service playbackState;
  @service scrubbing;
  @tracked playlist;

  constructor() {
    super(...arguments);
    this.loadPlaylist();
  }

  get playheadStyle() {
    const progress = (this.scrubbing.currentTime / this.scrubbing.duration) * 100;
    const style = `width: ${progress}%;`;
    return htmlSafe(style);
  }

  async loadPlaylist() {
    try {
      this.playlist = await this.song.getAllSongs();
      console.log(this.playlist);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  }

  @action
  async removeSong(id) {
    try {
      await this.song.deleteSong(id);
      
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  }

  @action
  async playSong(trackUri) {
    try {
      await this.spotify.playSong(trackUri);
      await this.playbackState.updatePlaybackState();
    
    } catch (error) {
      console.error('Error playing song:', error);
    }
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
 
  get hasPlaylist() {
    return this.playlist && this.playlist.length > 0;
  }
}
