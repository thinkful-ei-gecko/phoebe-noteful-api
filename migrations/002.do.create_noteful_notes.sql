CREATE TABLE noteful_notes (
  id TEXT PRIMARY KEY NOT NULL, 
  name TEXT NOT NULL, 
  modified DATE DEFAULT now(), 
  folderId TEXT REFERENCES noteful_folders(id) ON DELETE CASCADE NOT NULL, 
  content TEXT
);