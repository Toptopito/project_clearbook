"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
    // Associations will be defined here
    static associate(models) {
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
    static initialize(sequelize) {
        User.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            email: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password_hash: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            first_name: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
            },
            last_name: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
            },
            date_of_birth: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: true,
            },
            gender: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: true,
            },
            phone: {
                type: sequelize_1.DataTypes.STRING(20),
                allowNull: true,
            },
            last_login: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            password_reset_token: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            password_reset_expires: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            onboarding_completed: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
        }, {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: true,
            underscored: true,
        });
        return User;
    }
}
exports.User = User;
exports.default = User;
