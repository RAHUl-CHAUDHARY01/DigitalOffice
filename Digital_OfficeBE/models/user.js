import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Company, {
        foreignKey: 'company_id',
        as: 'company',
      });
    }

    static async comparePassword(candidatePassword, hashedPassword) {
      return await bcrypt.compare(candidatePassword, hashedPassword);
    }
  }

  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Companies',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'invited', 'inactive'),
        allowNull: false,
      },
      profile_image: {
        type: DataTypes.STRING(500), 
        allowNull: true,
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },

    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  User.beforeCreate(async (user) => {
    if (user.password && user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });
  
  User.beforeUpdate(async (user) => {
    if (user.password && user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });
  

  return User;
};
