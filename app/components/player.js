// player-component.js
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class PlayerComponent extends Component {
  @service playbackState;

  get currentSongTitle() {
    return this.playbackState.currentSongTitle;
  }

  get currentArtistName() {
    return this.playbackState.currentArtistName;
  }

  get currentAlbumCoverUrl() {
    return this.playbackState.currentAlbumCoverUrl;
  }
}
