"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabResult = void 0;
const sequelize_1 = require("sequelize");
class LabResult extends sequelize_1.Model {
    // Associations will be defined here
    static associate(models) {
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
    static initialize(sequelize) {
        LabResult.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            document_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'documents',
                    key: 'id',
                },
            },
            test_name: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            test_date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false,
            },
            result_value: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            unit: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
            },
            reference_range_low: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            reference_range_high: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            lab_name: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            ordering_doctor: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            notes: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            is_abnormal: {
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
            modelName: 'LabResult',
            tableName: 'lab_results',
            timestamps: true,
            underscored: true,
        });
        return LabResult;
    }
}
exports.LabResult = LabResult;
exports.default = LabResult;
