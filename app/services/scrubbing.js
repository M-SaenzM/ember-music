// app/services/scrubbing.js
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ScrubbingService extends Service {
  @service spotify;
  @service playbackState;

  @tracked isScrubbing = false;
  @tracked currentTime = 0;
  @tracked duration = 0;
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

  startScrubbing() {
    // Check if audio is playing before allowing scrubbing
    if (this.playbackState.isPlaying) {
      this.isScrubbing = true;
    }
  }

  handleScrubbing(event) {
    if (this.isScrubbing) {
      const containerWidth = event.target.parentElement.offsetWidth;
      const containerLeft =
        event.target.parentElement.getBoundingClientRect().left;
      const offsetX = event.clientX - containerLeft;

      let progress = offsetX / containerWidth;

      progress = Math.min(Math.max(progress, 0), 1);
      this.currentTime = Math.floor(this.duration * progress);

      this.spotify.seekPlayback(this.currentTime);
    }
  }

  stopScrubbing() {
    this.isScrubbing = false;
    this.spotify.seekPlayback(this.currentTime);
  }

  updatePlaybackState(playbackState) {
    this.currentTime = playbackState.progress_ms;
    if (playbackState.item && playbackState.item.duration_ms) {
      this.duration = playbackState.item.duration_ms;
    }
  }
}
