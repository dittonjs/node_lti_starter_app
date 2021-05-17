const { ReadPreference } = require('mongodb');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    async addToRole(name, contextId) {
      if (await this.hasRole(name, contextId)) return;
      await this.createRole({ name, contextId });
    }

    async hasRole(name, contextId) {
      const roles = await this.getRoles({
        where: {
          contextId,
          name,
        }
      });
      return roles.length > 0;
    }

    async isInstructor(contextId) {
      return this.hasRole('urn:lti:role:ims/lis/Instructor', contextId)
    }

    async isTA(contextId) {
      return this.hasRole('urn:lti:role:ims/lis/TeachingAssistant', contextId)
    }

    async isCreditLearner(contextId) {
      return this.hasRole('urn:lti:role:ims/lis/Learner', contextId)
    }

    async isNonCreditLearning(contextId) {
      return this.hasRole('urn:lti:role:ims/lis/Learner/NonCreditLearner', contextId)
    }

    async isDesigner(contextId) {
      return this.hasRole('urn:lti:role:ims/lis/ContentDeveloper', contextId)
    }

    static async fromLTI(launchParams) {
      const [user] = await this.findOrCreate({
        where: {
          lmsUserId: launchParams.custom_canvas_user_id,
        },
        defaults: {
          name: launchParams.lis_person_name_full,
          email: launchParams.lis_person_contact_email_primary,
          lmsUserId: launchParams.custom_canvas_user_id,
        }
      });

      const roles = launchParams.ext_roles.split(',');
      for (const role of roles) {
        await user.addToRole(role, launchParams.context_id);
      }
      return user;
    }

    static associate(models) {
      this.hasMany(models.Role, { foreignKey: 'userId', as: 'roles' });
      // define association here
    }
  };

  User.init({

    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    lmsUserId: DataTypes.NUMBER,
    
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
