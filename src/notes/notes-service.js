const NotesService = {
  getAllNotes(knex) {
    return knex.from('noteful_notes').select('*');
  },

  insertNote(knex, note) {
    return knex
      .insert(note)
      .into('noteful_notes')
      //I forget this part a lot 
      .returning('*')
      .then(rows => {
        return rows[0];
      })
  },

  getById(knex, id) {
    return knex('noteful_notes')
      .select('*')
      .where('id', id)
      .first()
  },

  deleteNote(knex, id) {
    return knex('noteful_notes')
      .where({ id })
      .delete()
  },

  updateNote(knex, id, fieldsToUpdate) {
    return knex('noteful_notes')
      .where({ id })
      .update(fieldsToUpdate)
  }
}

module.exports = NotesService;