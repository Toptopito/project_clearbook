import { Model, DataTypes, Sequelize, Optional, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin } from 'sequelize';

// Use type-only imports to avoid circular dependencies
type LabResult = any;
type Document = any;
type TrendData = any;

// Define interface for User attributes
interface UserAttributes {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date | null;
  gender: string | null;
  phone: string | null;
  created_at: Date;
  updated_at: Date;
  last_login: Date | null;
  password_reset_token: string | null;
  password_reset_expires: Date | null;
  onboarding_completed: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'date_of_birth' | 'gender' | 'phone' | 'last_login' | 'password_reset_token' | 'password_reset_expires'> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  // Define association mixins
  public getLabResults!: HasManyGetAssociationsMixin<LabResult>;
  public addLabResult!: HasManyAddAssociationMixin<LabResult, string>;
  public hasLabResult!: HasManyHasAssociationMixin<LabResult, string>;
  public countLabResults!: HasManyCountAssociationsMixin;
  public createLabResult!: HasManyCreateAssociationMixin<LabResult>;

  public getDocuments!: HasManyGetAssociationsMixin<Document>;
  public addDocument!: HasManyAddAssociationMixin<Document, string>;
  public hasDocument!: HasManyHasAssociationMixin<Document, string>;
  public countDocuments!: HasManyCountAssociationsMixin;
  public createDocument!: HasManyCreateAssociationMixin<Document>;

  public getTrendData!: HasManyGetAssociationsMixin<TrendData>;
  public addTrendData!: HasManyAddAssociationMixin<TrendData, string>;
  public hasTrendData!: HasManyHasAssociationMixin<TrendData, string>;
  public countTrendData!: HasManyCountAssociationsMixin;
  public createTrendData!: HasManyCreateAssociationMixin<TrendData>;
  public id!: string;
  public email!: string;
  public password_hash!: string;
  public first_name!: string;
  public last_name!: string;
  public date_of_birth!: Date | null;
  public gender!: string | null;
  public phone!: string | null;
  public created_at!: Date;
  public updated_at!: Date;
  public last_login!: Date | null;
  public password_reset_token!: string | null;
  public password_reset_expires!: Date | null;
  public onboarding_completed!: boolean;

  // Associations will be defined here
  static associate(models: any) {
    // User has many lab results
    User.hasMany(models.LabResult, {
      foreignKey: 'user_id',
      as: 'lab_results',
    });

    // User has many documents
    User.hasMany(models.Document, {
      foreignKey: 'user_id',
      as: 'documents',
    });

    // User has many trend data
    User.hasMany(models.TrendData, {
      foreignKey: 'user_id',
      as: 'trend_data',
    });
  }

  static initialize(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password_hash: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        first_name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        date_of_birth: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        gender: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        phone: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        last_login: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        password_reset_token: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        password_reset_expires: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        onboarding_completed: {
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
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        underscored: true,
      }
    );
    return User;
  }
}

// Export both the class and the interface for proper typing
export { User };
export default User;
