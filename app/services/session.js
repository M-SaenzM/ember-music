import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SessionService extends Service {
  @tracked isAuthenticated = false;
  @tracked accessToken = null;

  setAuthenticated(isAuthenticated) {
    this.isAuthenticated = isAuthenticated;
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }
}
