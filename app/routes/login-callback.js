import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LoginCallbackRoute extends Route {
  queryParams = {
    code: { refreshModel: true },
    state: { refreshModel: true },
  };

  @service session;
  @service router;

  async model(params) {
    const code = params.code;
    const state = params.state;
    const client_id = '1904b35142b34ec281525b39f9e832f5';
    const client_secret = 'd6a05bd8ea15410f98274e2b9e8922c3';
    const redirect_uri = process.env.NODE_ENV === 'production'
    ? 'https://ember-music-gray.vercel.app/login-callback'
    : 'http://localhost:4200/login-callback';
    if (state === null) {
      console.error('State Error');
      return;
    }

    if (!code) {
      console.error('Authorization code is missing.');
      return;
    }

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(client_id + ':' + client_secret),
      },
      body: `code=${code}&redirect_uri=${encodeURIComponent(redirect_uri)}&grant_type=authorization_code`,
    };

    try {
      const response = await fetch(authOptions.url, {
        method: authOptions.method,
        headers: authOptions.headers,
        body: authOptions.body,
      });

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.access_token;

        this.session.setAuthenticated(true);
        this.session.setAccessToken(accessToken);

        this.router.transitionTo('home');
      } else {
        const errorData = await response.json(); 
        console.error('Error Details:', errorData);
      }
    } catch (error) {
      console.error('Error exchanging code for access token:', error);
    }
  }
}
