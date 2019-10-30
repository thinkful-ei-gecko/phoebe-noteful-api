CREATE TABLE noteful_notes (
  id TEXT PRIMARY KEY NOT NULL, 
  name TEXT NOT NULL, 
  modified DATE DEFAULT now(), 
  folder_id TEXT REFERENCES noteful_folders(id) ON DELETE CASCADE NOT NULL, 
  content TEXT
);