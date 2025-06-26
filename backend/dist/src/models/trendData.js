"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendData = void 0;
const sequelize_1 = require("sequelize");
class TrendData extends sequelize_1.Model {
    // Associations will be defined here
    static associate(models) {
        // Trend data belongs to a user
        TrendData.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });
    }
    static initialize(sequelize) {
        TrendData.init({
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
            test_name: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            start_date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false,
            },
            end_date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false,
            },
            count: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            min_value: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            max_value: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            average: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            median: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            standard_deviation: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: true,
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
            modelName: 'TrendData',
            tableName: 'trend_data',
            timestamps: true,
            underscored: true,
        });
        return TrendData;
    }
}
exports.TrendData = TrendData;
exports.default = TrendData;
