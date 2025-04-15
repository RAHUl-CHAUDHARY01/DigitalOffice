import { Model } from 'sequelize';

export default (sequelize) => {

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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      domain: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      logoUrl: Sequelize.STRING, 
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    },
    {
      sequelize,
      modelName: 'Company',
      tableName: 'Companies',
      underscored: true,
      timestamps: false,
    }
  );

  return Company;
};



