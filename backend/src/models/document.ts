import { Model, DataTypes, Sequelize, Optional, HasOneGetAssociationMixin } from 'sequelize';

// Use type-only imports to avoid circular dependencies
type User = any;
type LabResult = any;

// Define interface for Document attributes
interface DocumentAttributes {
  id: string;
  user_id: string;
  lab_result_id: string | null;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  description: string | null;
  upload_date: Date;
  created_at: Date;
  updated_at: Date;
}

interface DocumentCreationAttributes extends Optional<DocumentAttributes, 'id' | 'description' | 'lab_result_id' | 'created_at' | 'updated_at'> {}

class Document extends Model<DocumentAttributes, DocumentCreationAttributes> {
  // Define association mixins
  public getUser!: HasOneGetAssociationMixin<User>;
  public getLabResult!: HasOneGetAssociationMixin<LabResult>;
  
  public id!: string;
  public user_id!: string;
  public lab_result_id!: string | null;
  public file_name!: string;
  public file_path!: string;
  public file_type!: string;
  public file_size!: number;
  public description!: string | null;
  public upload_date!: Date;
  public updated_at!: Date;

  // Associations will be defined here
  static associate(models: any) {
    // Document belongs to a user
    Document.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    // Document belongs to exactly one lab result
    Document.belongsTo(models.LabResult, {
      foreignKey: 'lab_result_id',
      as: 'lab_result',
    });
  }

  static initialize(sequelize: Sequelize) {
    Document.init(
      {
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
        },
        lab_result_id: {
          type: DataTypes.UUID,
          allowNull: true,
          unique: true, // Ensure one-to-one relationship with lab result
          references: {
            model: 'lab_results',
            key: 'id',
          },
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
      },
      {
        sequelize,
        modelName: 'Document',
        tableName: 'documents',
        timestamps: true,
        createdAt: 'upload_date',
        updatedAt: 'updated_at',
        underscored: true,
      }
    );
    return Document;
  }
}

// Export both the class and the interface for proper typing
export { Document };
export default Document;
