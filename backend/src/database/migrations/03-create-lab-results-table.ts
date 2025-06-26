import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('lab_results', {
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
      document_id: {
        type: DataTypes.UUID,
        allowNull: true, // Optional document
        references: {
          model: 'documents',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      test_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      test_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      result_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      unit: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      reference_range_low: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      reference_range_high: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      lab_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ordering_doctor: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_abnormal: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.addIndex('lab_results', ['user_id']);
    await queryInterface.addIndex('lab_results', ['test_name']);
    await queryInterface.addIndex('lab_results', ['test_date']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('lab_results');
  }
};
