const CardService = {
  getAllCards(knex, user_id) {
    return knex.select('*').from('cards').where('user_id', user_id);
  },
  addCard(knex, newCard) {
    return knex
      .insert(newCard)
      .into('cards')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id, user_id) {
    return knex
      .from('cards')
      .select('*')
      .where({ id: id, user_id: user_id })
      .first();
  },

  deleteCard(knex, id, user_id) {
    return knex('cards').where({ id: id, user_id: user_id }).delete();
  },

  updateCard(knex, id, updatedFields, user_id) {
    return knex
      .from('cards')
      .where({ id: id, user_id: user_id })
      .update(updatedFields);
  },
};

module.exports = CardService;
