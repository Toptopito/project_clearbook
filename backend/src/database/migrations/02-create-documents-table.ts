import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('documents', {
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
      lab_result_id: {
        type: DataTypes.UUID,
        allowNull: true, // Changed to nullable to break circular reference
        unique: true, // Enforce one-to-one relationship
      },
      file_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      file_path: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      file_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      file_size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      upload_date: {
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
    await queryInterface.addIndex('documents', ['user_id']);
    await queryInterface.addIndex('documents', ['lab_result_id'], { unique: true });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('documents');
  }
};
