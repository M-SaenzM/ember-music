import Model, { attr } from '@ember-data/model';

export default class SongModel extends Model {
  @attr title;
  @attr length;
  @attr artist;
  @attr img;
  @attr uri;
}
