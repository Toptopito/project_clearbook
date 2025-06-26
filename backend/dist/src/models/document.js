"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
const sequelize_1 = require("sequelize");
class Document extends sequelize_1.Model {
    // Associations will be defined here
    static associate(models) {
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
    static initialize(sequelize) {
        Document.init({
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
            lab_result_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
                unique: true, // Ensure one-to-one relationship with lab result
                references: {
                    model: 'lab_results',
                    key: 'id',
                },
            },
            file_name: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            file_path: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            file_type: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
            },
            file_size: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            upload_date: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
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
            modelName: 'Document',
            tableName: 'documents',
            timestamps: true,
            createdAt: 'upload_date',
            updatedAt: 'updated_at',
            underscored: true,
        });
        return Document;
    }
}
exports.Document = Document;
exports.default = Document;
