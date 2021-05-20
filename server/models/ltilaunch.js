'use strict';
const crypto = require('crypto');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LtiLaunch extends Model {

    static async fromConfig(config) {
      const token = crypto.randomBytes(16).toString('hex');
      return this.create({
        config,
        token
      });
    }

    get launchUrl() {
      return `${process.env.APP_URL}/lti_launches/${this.token}`;
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  LtiLaunch.init({
    token: DataTypes.STRING,
    config: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'LtiLaunch',
  });
  return LtiLaunch;
};