require('dotenv').config();
const path = require('path');
const express = require('express');
const xss = require('xss');

const FoldersService = require('./folders-service');

const foldersRouter = express.Router();
const responseJson = express.json();

const serializeFolder = folder => ({
  name: xss(folder.name), 
  id: folder.id
})

foldersRouter
  .route('/')
  .get((req, res, next) => {
    FoldersService.getAllFolders(
      req.app.get('db')
    )
      .then(folders => res.json(folders.map(serializeFolder)))
      .catch(next)
  })
  .post(responseJson, (req, res, next) => {
    const { name, id } = res.body;
    const newFolder = { name }

    if (name === null) {
      return res
        .status(400)
        .json({
          error: { message: `Missing name is request body`}
        })
    }

    newFolder.id = id;

    FoldersService.insertFolder(
      req.app.get('db'), 
      newFolder
    )    
      .then(numOfRowsAffected => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl + '/${newFolder.id}'))
          .json(serializeFolder(newFolder))
      })
      .catch(next);
  })


foldersRouter
  .route('/:folder_id')
  .all(responseJson, (req, res, next) => {
    FoldersService.getById(
      req.app.get('db'), 
      req.params.folder_id
    )
      .then(folder => {
        if (!folder) {
          return res
            .status(404)
            .json({
              error: { message: `Folder does not exist`}
            })
        }
        res.folder = folder
        next()
      })
      .catch(next);
  })
  .get((req, res, next) => {
    return res.json(serializeJson(res.folder));
  })
  .delete((req, res, next) => {
    FoldersService.deleteFolder(
      req.app.get('db'), 
      req.params.folder_id
    )
      .then(numOfRowsAffected => {
        res.status(204).end()
      })
      .catch(next);
  })
  .patch(responseJson, (req, res, next) => {
    const { name } = req.body;
    const fieldToUpdate = { name }; 

    serializeFolder(fieldToUpdate);

    const numOfValues = Object.values(folderToUpdate).filter(Boolean).length;
    if (numOfValues === 0)
      return res.status(400).json({
        error: { message: `Request body must contain folder name`}
      })

    FoldersService.updateFolder(
      req.app.get('db'),
      req.params.folder_id, 
      fieldToUpdate
    )
      .then(numOfRowsAffected => res.status(201).end())
      .catch(next);
  })

module.exports = foldersRouter;
