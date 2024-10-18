import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SongService extends Service {
  //This injects Ember Data's store service into the SongService. 
  //The store service allows you to interact with your application's 
  //data store, making it possible to perform CRUD operations on models.
  @service store;

  //Defines an action method getAllSongs(). 
  //This method uses this.store.findAll('song') to retrieve all songs from 
  //the store asynchronously and returns the result.
  @action
  async getAllSongs() {
    const allData = await this.store.findAll('song');

    return allData;
  }

  //Defines an action method addSong() for adding a new song. 
  @action
  addSong(songUri, songImg, songTitle, songArtist, songLength) {
    // get the input value from the .hbs template
    let sTitle = songTitle;
    let sArtist = songArtist;
    let sLength = songLength.toString();
    let sImg = songImg;
    let sUri = songUri;
    // create a record in Ember Data (locally, would not survive page refresh)
    let newRecord = this.store.createRecord('song', {
      title: sTitle,
      length: sLength,
      artist: sArtist,
      img: sImg,
      uri: sUri,
    });
    // Save the record to the API endpoint specified in adapters/application.js
    newRecord.save();
  }

  //Defines an action method deleteSong() for deleting a song.
  @action
  async deleteSong(songId) {

    let song = this.store.peekRecord('song', songId);
    song.deleteRecord();
   // song.isDeleted; // => true
    song.save();
    this.getAllSongs();
  }
}
