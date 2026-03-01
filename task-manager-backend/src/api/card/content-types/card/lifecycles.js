module.exports = {
    async beforeDelete(event) {
        const { where } = event.params;
        // Vous pouvez ajouter ici du logging ou d'autres actions
        console.log(`Deleting card with id: ${where.id}`);
    },
};