require('dotenv').config();
const path = require('path');
const NotesService = require('./notes-service');
const express = require('express');
const xss = require('xss');

const notesRouter = express.Router();
const responseJson = express.json();

const serializeNote = note => ({
  id: note.id,
  name: xss(note.name), 
  modified: note.modified, 
  folderId: note.folderId, 
  content: xss(note.content)
})

notesRouter
  .route('/')
  .get((req, res, next) => {
    NotesService.getAllNotes(
      req.app.get('db')
    )
      // no need to pass a 200 response... i think that's the browser's default
      .then(notes => res.json(notes.map(serializeNote)))
      .catch(next)
  })
  .post(responseJson, (req, res, next) => {
    const { id, name, modified, folderId, content } = req.body;
    const newNote = { name, content }
    
    for (const [key, value] in Object.keys(newNote)) {
      if (value == null) {
        return res => res.json({
          error: { message: `Missing ${key} in request body`}
        })
      }
    }

    newNote.id = id;
    newNote.modified = modified;
    newNote.folderId = folderId;
    
    NotesService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(numOfRowsAffected => {
        //why is no return needed here? 
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${newNote.id}`))
          .json(serializeNote(newNote))
      })
      .catch(next)
  })

notesRouter 
  .route('/:note_id')
  .all(responseJson, (req, res, next) => {
    
    NotesService.getById(
      req.app.get('db'), 
      req.params.note_id
    )
      .then(note => {
        // if note doesn't exist/can't be found
        if (!note) {
          return res.status(404).json({
            error: { message: `Note does not exist`}
          })
        }

        return res.note = note;
        next();
      })
      .catch(next)
  })
  .get((req, res, next) => 
    res.json(serializeNote(res.note))
  )
  .delete((req, res, next) => {
    NotesService.deleteNote(
      req.app.get('db'), 
      req.params.note_id, 
    )
      .then(numOfRowsAffected => {
        return res.status(204).end()
      })
      .catch(next)
  })
  .patch(responseJson, (req, res, next) => {
    const { name, folderId, content } = req.body;
    const fieldsToUpdate = { name, folderId, content };

    NotesService.updateNote(
      req.app.get('db'), 
      req.params.note_id, 
      fieldsToUpdate
    )
      .then(numOfRowsAffected => {
        return res.status(204).end()
      })
      .catch(next)
  })

module.exports = notesRouter;
