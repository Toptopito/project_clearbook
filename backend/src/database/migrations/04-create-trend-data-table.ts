import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('trend_data', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      test_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      min_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      max_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      average: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      median: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      standard_deviation: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
    
    // Add indexes
    await queryInterface.addIndex('trend_data', ['user_id']);
    await queryInterface.addIndex('trend_data', ['test_name']);
    await queryInterface.addIndex('trend_data', ['start_date']);
    await queryInterface.addIndex('trend_data', ['end_date']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('trend_data');
  }
};
