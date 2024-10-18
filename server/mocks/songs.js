//'use strict';
//This imports the v4 method from the uuid package, this method generates UUIDs.
const { v4: uuidv4 } = require('uuid');

//These import Node.js core modules fs (file system) and path for file manipulation.
const fs = require('fs');
const path = require('path');

// Path to the JSON file
const jsonFilePath = path.join(__dirname, 'songs.json');

// Read the JSON file
//reads the file and parses its content into JSON,
function readJSON() {
  try {
    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return { data: [] }; // Return an object with empty data array in case of error
  }
}

//writes new data to the JSON file
function writeJSON(newRecord) {
  let songs = readJSON();
  //console.log(songs);
  songs.data.push(newRecord);
  //console.log(songs);
  const jsonData = JSON.stringify(songs, null, 2);
  fs.writeFileSync(jsonFilePath, jsonData, 'utf-8');
}

//This function deletes a song from the JSON file based on its ID.
function deleteSongJSON(songId) {
  let songs = readJSON();
  // Find the index of the song with the specified ID
  const index = songs.data.findIndex((song) => song.id === songId.toString());

  if (index !== -1) {
    // Remove the song from the array
    songs.data.splice(index, 1);
    const jsonData = JSON.stringify(songs, null, 2);
    fs.writeFileSync(jsonFilePath, jsonData, 'utf-8'); // Write the updated data back to the file
  } else {
    console.log(`Song with ID ${songId} not found`);
  }
}

module.exports = function (app) {
  const express = require('express');
  //A router in Express is like a mini Express application, capable of performing middleware and routing functions.
  //Once created, songRouter can be used to define routes, middleware, and handle HTTP requests related to songs.
  //After creating the router instance, you can define route handlers for various HTTP methods 
  //(such as GET, POST, PUT, DELETE) on this router instance.
  let songRouter = express.Router();

  /* ROUTE HANDLERS!! */
  //GET /api/songs: Retrieves all songs from the JSON file and sends them as a response.
  songRouter.get('/', function (req, res) {
    const records = readJSON();
    res.send(records);
    res.status(200).end();
  });

  //POST /api/songs: Adds a new song to the JSON file. It generates a UUID for the new song, 
  // extracts attributes from the request body, creates a new song object, and writes it to the JSON file.
  songRouter.post('/', function (req, res) {
    let _id = uuidv4(); // Generate a new UUID for the resource
    const attr = req.body.data.attributes;
    const tp = req.body.data.type;

    const newSong = {
      id: _id,
      attributes: attr,
      type: 'song',
    };

    res.send({ data: { newSong } });
    writeJSON(newSong);
    res.status(201).end();
  });
 

  //Deletes a song from the JSON file based on its ID.
  songRouter.delete('/:id', function (req, res) {
    //this line sets the HTTP status code of the response to 204 (No Content)
    //to indicate that the request has been successfully processed
    deleteSongJSON(req.params.id);
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //

  // Mounting the router to handle requests
  //  This line mounts the songRouter on the /api/songs route, 
  // meaning that all requests to routes starting with /api/songs will be handled by songRouter.
  app.use(
    '/api/songs',
    require('body-parser').json({ type: 'application/*+json' }),
    songRouter,
  );
  //app.use('/api/playlist', playlistRouter);
};


