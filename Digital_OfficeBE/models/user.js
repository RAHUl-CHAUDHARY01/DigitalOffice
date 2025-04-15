import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt'; 

export default (sequelize) => {

  class User extends Model {

    static associate(models) {

      User.belongsTo(models.Company, {
        foreignKey: 'company_id',
        as: 'company', // Alias for the association
      });
    }

    // Method to compare the password with the hashed password in the DB
    static async comparePassword(candidatePassword, hashedPassword) {
      return await bcrypt.compare(candidatePassword, hashedPassword);
    }
    
  }

  // User model definition
  User.init(
    {
      company_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Companies',
          key: 'id',
        },
        onDelete: 'CASCADE', // Deletes users when a company is deleted
      },
      name: {
        type:DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'invited', 'inactive'),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      underscored: true, 
      timestamps: false, // Disable automatic timestamp columns since we have custom ones
    }
  );

  // Hook to hash the password before saving it
  User.beforeCreate(async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10); // Create a salt
      user.password = await bcrypt.hash(user.password, salt); // Hash the password
    }
  });

  // Hook to hash the password before updating it
  User.beforeUpdate(async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10); // Create a salt
      user.password = await bcrypt.hash(user.password, salt); // Hash the password
    }
  });

  return User;
};
