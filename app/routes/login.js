import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LoginRoute extends Route {
  @service session;
  @service router;

  beforeModel() {
    const state = this.generateRandomString(16);

    const client_id = '1904b35142b34ec281525b39f9e832f5';
    const redirect_uri = 'https://ember-music-gray.vercel.app/login-callback';
    const scope =
      'user-read-private user-read-email user-modify-playback-state user-read-playback-state streaming';

    // Store state and redirect URI in session for later retrievel
    this.session.set('spotifyAuthState', state);
    this.session.set('spotifyredirectUri', redirect_uri);

    // Construct Spotify authorization URL
    const authorizationUrl =
      `https://accounts.spotify.com/authorize?` +
      `response_type=code&` +
      `client_id=${client_id}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `redirect_uri=${encodeURIComponent(redirect_uri)}&` +
      `state=${state}`;

    // Redirect the user to Spotify authorization URL
    window.location.href = authorizationUrl;
  }

  // Function to generate a random string
  generateRandomString(length) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }
}
