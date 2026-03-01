module.exports = {
    async beforeDelete(event) {
        const { where } = event.params;

        const column = await strapi.entityService.findOne(
            'api::column.column',
            where.id,
            { populate: ['cards'] }
        );

        if (column && column.cards && column.cards.length > 0) {
            for (const card of column.cards) {
                await strapi.entityService.delete('api::card.card', card.id);
            }
        }
    },
};