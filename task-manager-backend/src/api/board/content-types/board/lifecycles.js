module.exports = {
  async beforeDelete(event) {
    const { where } = event.params;


    // on cherche le board à supprimer avec ses colonnes et ses cartes
    const board = await strapi.entityService.findOne('api::board.board',
        where.id,{populate: {columns: {populate: ['cards'],},cards: true,},});

    if (!board) return;

    //supressions des cards des colonnes
    if (board.columns) {
      for (const column of board.columns) {
        if (column.cards) {
          for (const card of column.cards) {
            await strapi.entityService.delete('api::card.card', card.id);
          }
        }

        await strapi.entityService.delete('api::column.column', column.id);
      }
    }

    //supprimer les cards liées directement au board
    //pas besoin des colonnes pour les trouver, elles sont liées directement au board, pas les cards
    if (board.cards) {
      for (const card of board.cards) {
        await strapi.entityService.delete('api::card.card', card.id);
      }
    }
  },
};