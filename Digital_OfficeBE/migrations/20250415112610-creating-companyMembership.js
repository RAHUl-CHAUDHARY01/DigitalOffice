'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('CompanyMemberships', {
    company_membership_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id',
      },
      onDelete: 'CASCADE',
    },
    company_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Companies',
        key: 'company_id',
      },
      onDelete: 'CASCADE',
    },
    role: {
      type: Sequelize.ENUM('Admin', 'HR', 'Employee','Manager'),
      allowNull: false,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('CompanyMemberships');
}
