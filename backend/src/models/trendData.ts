import { Model, DataTypes, Sequelize, Optional, HasOneGetAssociationMixin } from 'sequelize';

// Use type-only imports to avoid circular dependencies
type User = any;

// Define interface for TrendData attributes
interface TrendDataAttributes {
  id: string;
  user_id: string;
  test_name: string;
  start_date: Date;
  end_date: Date;
  count: number;
  min_value: number | null;
  max_value: number | null;
  average: number | null;
  median: number | null;
  standard_deviation: number | null;
  created_at: Date;
  updated_at: Date;
}

interface TrendDataCreationAttributes extends Optional<TrendDataAttributes, 'id' | 'min_value' | 'max_value' | 'average' | 'median' | 'standard_deviation'> {}

class TrendData extends Model<TrendDataAttributes, TrendDataCreationAttributes> {
  // Define association mixins
  public getUser!: HasOneGetAssociationMixin<User>;
  public id!: string;
  public user_id!: string;
  public test_name!: string;
  public start_date!: Date;
  public end_date!: Date;
  public count!: number;
  public min_value!: number | null;
  public max_value!: number | null;
  public average!: number | null;
  public median!: number | null;
  public standard_deviation!: number | null;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations will be defined here
  static associate(models: any) {
    // Trend data belongs to a user
    TrendData.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }

  static initialize(sequelize: Sequelize) {
    TrendData.init(
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
      },
      {
        sequelize,
        modelName: 'TrendData',
        tableName: 'trend_data',
        timestamps: true,
        underscored: true,
      }
    );
    return TrendData;
  }
}

// Export both the class and the interface for proper typing
export { TrendData };
export default TrendData;
