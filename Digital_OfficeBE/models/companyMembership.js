import { Model, DataTypes } from 'sequelize';

export default (sequelize, DataTypes) => {
    class CompanyMembership extends Model {
        static associate(models) {
            // Belongs to User
            CompanyMembership.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user',
            });

            // Belongs to Company
            CompanyMembership.belongsTo(models.Company, {
                foreignKey: 'company_id',
                as: 'company',
            });
        }
    }

    CompanyMembership.init(
        {

            company_membership_id: {

                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,

            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'user_id',
                },
                onDelete: 'CASCADE',
            },
            company_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Companies',
                    key: 'company_id',
                },
                onDelete: 'CASCADE',
            },
            role: {
                type: DataTypes.ENUM('Admin', 'HR', 'Employee','Manager'),
                allowNull: false,
            },

        },
        {
            sequelize,
            modelName: 'CompanyMembership',
            tableName: 'CompanyMemberships',
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    return CompanyMembership;
};
