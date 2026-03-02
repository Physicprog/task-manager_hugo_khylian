module.exports = {
  async beforeDelete(event) {
    const { where } = event.params;

    // Find all boards for the user
    const boards = await strapi.entityService.findMany('api::board.board', {
      filters: { user: { id: where.id } },
      populate: ['columns', 'cards']
    });

    for (const board of boards) {
      // Delete all columns for this board
      if (board.columns && board.columns.length > 0) {
        for (const column of board.columns) {
          // Delete all cards in this column
          const columnWithCards = await strapi.entityService.findOne('api::column.column', column.id, { populate: ['cards'] });
          if (columnWithCards.cards && columnWithCards.cards.length > 0) {
            for (const card of columnWithCards.cards) {
              await strapi.entityService.delete('api::card.card', card.id);
            }
          }
          await strapi.entityService.delete('api::column.column', column.id);
        }
      }
      // Delete all cards directly linked to the board (not in columns)
      if (board.cards && board.cards.length > 0) {
        for (const card of board.cards) {
          await strapi.entityService.delete('api::card.card', card.id);
        }
      }
      await strapi.entityService.delete('api::board.board', board.id);
    }
  },
};