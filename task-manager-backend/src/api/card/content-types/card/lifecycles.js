//supprime les cards, ne prend rien en paramètre car c'est une feuille, sans relation
module.exports = {
    async beforeDelete(event) {
        const { where } = event.params;
    },
};