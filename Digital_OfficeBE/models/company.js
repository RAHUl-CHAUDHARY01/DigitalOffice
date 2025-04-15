import { Model, DataTypes } from 'sequelize';

export default (sequelize, DataTypes) => {

  class Company extends Model {

    static associate(models) {
      // A company has many users
      Company.hasMany(models.User, {
        foreignKey: 'company_id',
        as: 'users', // Alias for the association
      });
    }


  }

  Company.init(
    {

      company_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      domain: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      logo_url: DataTypes.STRING,


    },
    {
      sequelize,
      modelName: 'Company',
      tableName: 'Companies',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );

  return Company;
};



