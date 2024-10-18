import EmberRouter from '@ember/routing/router';
import config from 'music-app/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('home', { path: '/' });
  this.route('search');
  this.route('playlist', { path: '/playlist/:playlist_id' });
  this.route('album', { path: '/album/:album_id' });
  this.route('artist', { path: '/artist/:artist_id' });
  this.route('login');
  this.route('login-callback');
  this.route('login-error');
});
