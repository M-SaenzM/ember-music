import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';

export default class PlayerControlsComponent extends Component {
  @service session;
  @service spotify;
  @service playbackState;
  @service scrubbing;

  get isPlaying() {
    return this.playbackState.isPlaying;
  }

  get playheadStyle() {
    const progress = (this.scrubbing.currentTime / this.scrubbing.duration) * 100;
    const style = `width: ${progress}%;`;
    return htmlSafe(style);
  }

  @action
  startScrubbing(event) {
    this.scrubbing.startScrubbing();
    this.scrubbing.handleScrubbing(event);
  }

  @action
  handleScrubbing(event) {
    this.scrubbing.handleScrubbing(event);
  }

  @action
  stopScrubbing() {
    this.scrubbing.stopScrubbing();
  }

  @action
  async togglePlayback() {
    try {
      if (this.isPlaying) {
        await this.spotify.pause();
      } else {
        await this.spotify.play();
      }
      
      // Update playback state in the scrubbing service
      const playbackState = await this.spotify.getPlaybackState();
      this.scrubbing.updatePlaybackState(playbackState);
      
      // Start or stop updating playback state periodically
      if (this.isPlaying) {
        this.timeUpdateInterval = setInterval(async () => {
          const playbackState = await this.spotify.getPlaybackState();
          this.scrubbing.updatePlaybackState(playbackState);
        }, 1000);
      } else {
        clearInterval(this.timeUpdateInterval);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  }
  
}
