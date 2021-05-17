'use strict';
const {Op} = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nonce extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async clean() {
      await this.destroy({
        where: {
          createdAt: {
            [Op.lt]: new Date(new Date() - (6 * 60 * 60 * 1000)) // 6 hours
          }
        }
      });
    }
    static async validateNonce(nonce) {
      await this.create({ nonce });
    }

    static associate(models) {
      // define association here
    }
  };
  Nonce.init({
    nonce: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  }, {
    sequelize,
    modelName: 'Nonce',
  });
  return Nonce;
};