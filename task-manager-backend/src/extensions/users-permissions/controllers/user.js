// Controller personnalisé pour users-permissions

module.exports = {
  async deleteMe(ctx) {
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
  },
};
