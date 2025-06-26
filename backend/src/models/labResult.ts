import { Model, DataTypes, Sequelize, Optional, HasOneGetAssociationMixin } from 'sequelize';

// Use type-only imports to avoid circular dependencies
type User = any;
type Document = any;

// Define interface for LabResult attributes
interface LabResultAttributes {
  id: string;
  user_id: string;
  document_id: string | null;
  test_name: string;
  test_date: Date;
  result_value: number;
  unit: string;
  reference_range_low: number | null;
  reference_range_high: number | null;
  lab_name: string | null;
  ordering_doctor: string | null;
  notes: string | null;
  is_abnormal: boolean;
  created_at: Date;
  updated_at: Date;
}

interface LabResultCreationAttributes extends Optional<LabResultAttributes, 'id' | 'document_id' | 'reference_range_low' | 'reference_range_high' | 'lab_name' | 'ordering_doctor' | 'notes'> {}

class LabResult extends Model<LabResultAttributes, LabResultCreationAttributes> {
  // Define association mixins
  public getUser!: HasOneGetAssociationMixin<User>;
  public getDocument!: HasOneGetAssociationMixin<Document>;
  
  public id!: string;
  public user_id!: string;
  public document_id!: string | null;
  public test_name!: string;
  public test_date!: Date;
  public result_value!: number;
  public unit!: string;
  public reference_range_low!: number | null;
  public reference_range_high!: number | null;
  public lab_name!: string | null;
  public ordering_doctor!: string | null;
  public notes!: string | null;
  public is_abnormal!: boolean;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations will be defined here
  static associate(models: any) {
    // Lab result belongs to a user
    LabResult.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    // Lab result has one optional document
    LabResult.belongsTo(models.Document, {
      foreignKey: 'document_id',
      as: 'document',
      constraints: false, // Optional relationship
    });
  }

  static initialize(sequelize: Sequelize) {
    LabResult.init(
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
        document_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'documents',
            key: 'id',
          },
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
      },
      {
        sequelize,
        modelName: 'LabResult',
        tableName: 'lab_results',
        timestamps: true,
        underscored: true,
      }
    );
    return LabResult;
  }
}

// Export both the class and the interface for proper typing
export { LabResult };
export default LabResult;
