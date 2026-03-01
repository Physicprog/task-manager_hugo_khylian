module.exports = {
    async beforeDelete(event) {
        const { where } = event.params;

        // Find the board with columns and cards
        const board = await strapi.entityService.findOne(
            'api::board.board',
            where.id,
            { populate: ['columns', 'cards'] }
        );

        // Delete all columns and their cards
        if (board && board.columns) {
            for (const column of board.columns) {
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
        if (board && board.cards) {
            for (const card of board.cards) {
                await strapi.entityService.delete('api::card.card', card.id);
            }
        }
    },
};