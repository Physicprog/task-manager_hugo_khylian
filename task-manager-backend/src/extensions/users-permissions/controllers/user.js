// Controller personnalisé pour users-permissions
const { sanitize } = require('@strapi/utils');

module.exports = (plugin) => {
  // Étendre le contrôleur par défaut au lieu de le remplacer
  const originalMe = plugin.controllers.user.me;
  
  plugin.controllers.user.me = async (ctx) => {
    // Appeler la méthode me originale pour PUT /api/users/me
    await originalMe(ctx);
  };

  // Ajouter notre méthode personnalisée deleteMe
  plugin.controllers.user.deleteMe = async (ctx) => {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("You must be logged in to delete your account.");
    }
    try {
      await strapi.db.query('plugin::users-permissions.user').delete({ where: { id: user.id } });
      ctx.send({ message: "Account deleted successfully." });
    } catch (err) {
      ctx.throw(500, "Failed to delete account.");
    }
  };

  return plugin;
};
